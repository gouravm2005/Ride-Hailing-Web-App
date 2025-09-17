const axios = require('axios');
const fetch = require("node-fetch");
const Captain = require('../Models/captain.model')
const Ride = require('../Models/ride.model')
const User = require('../Models/user.model')

module.exports.getLocationSuggestions = async (req, res) => {
  try {
      res.set("Cache-Control", "no-store");
    const { query } = req.query;
    if (!query) return res.json({ suggestions: [] });

    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": `${process.env.APP_NAME}/1.0 (${process.env.APP_EMAIL})`
      }
    });
    const data = await response.json();

    const suggestions = data.map((item) => ({
      name: item.display_name,
      lat: item.lat,
      lon: item.lon
    }));

    res.json({ suggestions });
  } catch (err) {
    console.error("Error fetching OSM suggestions:", err.message);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
}

// helper to add offset
function offsetCoords(lat, lng, kmNorth, kmEast) {
  const latOffset = kmNorth / 111; // 1° lat ~ 111 km
  const lngOffset = kmEast / (111 * Math.cos((lat * Math.PI) / 180));
  return [lng + lngOffset, lat + latOffset];
}

async function getCoordinates(placeName) {
  try {
    if (!placeName || typeof placeName !== "string" || placeName.trim() === "") {
      return { lat: 0, lng: 0 };
    }

    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: placeName, format: "json", limit: 1 },
      headers: { "User-Agent": "RideApp/1.0" }, // Nominatim requires this
    });

    if (res.data && res.data.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lng: parseFloat(res.data[0].lon),
      };
    }
    return { lat: 0, lng: 0 };
  } catch (err) {
    console.error("Geocoding error:", err.message);
    return { lat: 0, lng: 0 };
  }
}

// ✅ Add random offset around pickup (different per captain)
function addRandomOffset(lat, lng, maxOffsetKm = 1) {
  if (!lat || !lng) return { lat: 0, lng: 0 };

  const latOffset = (Math.random() - 0.5) * (maxOffsetKm / 111); // 1° lat ≈ 111km
  const lngOffset =
    (Math.random() - 0.5) *
    (maxOffsetKm / (111 * Math.cos((lat * Math.PI) / 180))); // adjust for earth curve

  return {
    lat: parseFloat((lat + latOffset).toFixed(6)),
    lng: parseFloat((lng + lngOffset).toFixed(6)),
  };
}

module.exports.updateCaptainLocation = async (req, res) => {
  try {
    let { pickup, pickuplnglat, destination, destinationlnglat } = req.body;

    // ✅ Basic validation
    if (!pickup || !destination) {
      return res
        .status(400)
        .json({ message: "Pickup and destination are required" });
    }

    // ✅ Normalize input (handle empty, null, string, 0)
    const isInvalid = (coord) =>
      !coord || coord === "" || coord === 0 || isNaN(Number(coord));

    if (
      !pickuplnglat ||
      isInvalid(pickuplnglat.lat) ||
      isInvalid(pickuplnglat.lng)
    ) {
      pickuplnglat = await getCoordinates(pickup);
    } else {
      pickuplnglat = {
        lat: parseFloat(pickuplnglat.lat),
        lng: parseFloat(pickuplnglat.lng),
      };
    }

    if (
      !destinationlnglat ||
      isInvalid(destinationlnglat.lat) ||
      isInvalid(destinationlnglat.lng)
    ) {
      destinationlnglat = await getCoordinates(destination);
    } else {
      destinationlnglat = {
        lat: parseFloat(destinationlnglat.lat),
        lng: parseFloat(destinationlnglat.lng),
      };
    }

    // ✅ Get all captains
    const captains = await Captain.find();
    if (!captains.length) {
      return res.status(404).json({ message: "No captains found" });
    }

    // ✅ Update captains with unique nearby locations
    const updates = captains.map((captain) => {
      const randomCoords = addRandomOffset(
        pickuplnglat.lat,
        pickuplnglat.lng,
        1 // within 1 km
      );

      return Captain.findByIdAndUpdate(
        captain._id,
        {
          pickup,
          pickupCoordinates: {
            type: "Point",
            coordinates: [pickuplnglat.lng, pickuplnglat.lat],
          },
          destination,
          destinationCoordinates: {
            type: "Point",
            coordinates: [destinationlnglat.lng, destinationlnglat.lat],
          },
          // 🚕 Each captain → slightly different random location
          location: {
            type: "Point",
            coordinates: [randomCoords.lng, randomCoords.lat],
          },
        },
        { new: true }
      );
    });

    const updatedCaptains = await Promise.all(updates);

    res.status(200).json({
      message: "Captains updated successfully with pickup, destination & nearby unique locations",
      captains: updatedCaptains,
    });
  } catch (error) {
    console.error("Error updating captains:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// helper: distance & duration
async function getDistanceDuration(pickuplnglat, destinationlnglat) {
  try {
    if (
      !pickuplnglat?.lat || !pickuplnglat?.lng ||
      !destinationlnglat?.lat || !destinationlnglat?.lng
    ) {
      console.error("Invalid coordinates:", pickuplnglat, destinationlnglat);
      return { distance: 0, duration: 0 };
    }

    const url = `http://router.project-osrm.org/route/v1/driving/${pickuplnglat.lng},${pickuplnglat.lat};${destinationlnglat.lng},${destinationlnglat.lat}?overview=false&geometries=geojson`;
    const res = await axios.get(url);

    if (res.data.routes && res.data.routes.length > 0) {
      const route = res.data.routes[0];
      return {
        distance: parseFloat((route.distance / 1000).toFixed(2)), // km
        duration: parseInt((route.duration / 60).toFixed(0)),    // minutes
      };
    }
    return { distance: 0, duration: 0 };
  } catch (err) {
    console.error("OSRM error:", err.message);
    return { distance: 0, duration: 0 };
  }
}

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports.requestRide = async (req, res) => {
  try {
    const { captainId, pickup, destination, pickuplnglat, destinationlnglat, rideType } = req.body;

    if (!captainId || !pickup || !destination || !pickuplnglat || !destinationlnglat || !rideType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // calculate distance & duration
    const { distance, duration } = await getDistanceDuration(pickuplnglat, destinationlnglat);

    // simple rate system
    const rates = { motorcycle: 10, auto: 15, car: 20 };
    const ratePerKm = rates[rideType] || 15;
    const fare = Math.round(distance * ratePerKm);

    const ride = new Ride({
      user: req.user._id,
      captain: captainId,
      pickup: {address : pickup, lat: pickuplnglat.lat, lng: pickuplnglat.lng},
      destination : {address : destination, lat: destinationlnglat.lat, lng:destinationlnglat.lng},
      ridetype: rideType,
      fare,
      distance,
      duration,
      otp: generateOtp(),
      status: "requested",
    });

    await ride.save();

    return res.status(201).json({
      message: "Ride requested successfully",
      ride,
    });
  } catch (error) {
    console.error("Error creating ride:", error);
    return res.status(500).json({ message: "Error creating ride", error: error.message });
  }
};

module.exports.getAllUserRides = async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user._id })
      .populate('user', 'fullname email')
      .populate('captain', 'fullname email vehicle rideStats')
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    console.error('Error fetching rides:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.getUserRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
    .populate("captain", "fullname email")
    .populate("user", "fullname, email" )
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getAllCaptainRides = async (req, res) => {
  try {
    const rides = await Ride.find({ captain: req.captain._id })
      .populate("user", "name email")
      .populate('captain', 'fullname email vehicle rideStats')
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getCaptainRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("user", "name email");
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getRideETA = async (req, res) => {
 const {pickuplnglat, destinationlnglat} = req.body;
   try {
    if (
      !pickuplnglat?.lat || !pickuplnglat?.lng ||
      !destinationlnglat?.lat || !destinationlnglat?.lng
    ) {
      console.error("Invalid coordinates:", pickuplnglat, destinationlnglat);
      return { distance: 0, duration: 0 };
    }

    const url = `http://router.project-osrm.org/route/v1/driving/${pickuplnglat.lng},${pickuplnglat.lat};${destinationlnglat.lng},${destinationlnglat.lat}?overview=false&geometries=geojson`;
    const res = await axios.get(url);

    if (res.data.routes && res.data.routes.length > 0) {
      const route = res.data.routes[0];
      return {
        distance: parseFloat((route.distance / 1000).toFixed(2)), // km
        duration: parseInt((route.duration / 60).toFixed(0)),    // minutes
      };
    }
    return { distance: 0, duration: 0 };
  } catch (err) {
    console.error("OSRM error:", err.message);
    return { distance: 0, duration: 0 };
  }
}

