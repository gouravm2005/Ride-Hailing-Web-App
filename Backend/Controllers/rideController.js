const axios = require('axios');
const fetch = require("node-fetch");
const Captain = require('../models/captain.model.js')
const Ride = require('../models/ride.model.js')
const User = require('../models/user.model.js')
const { createNotification } = require("./notificationController.js");
const { sendToUser, sendToCaptain, sendToRideRoom} = require("../Socket/socketManager.js");
const Notification = require('../models/notification.model.js');
const { startRideSimulation } = require("../Services/rideTracking.service.js");

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
      headers: { "User-Agent": "RideApp/1.0" },
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

// Add random offset around pickup (different per captain)
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

    if (!pickup || !destination) {
      return res
        .status(400)
        .json({ message: "Pickup and destination are required" });
    }

    // Normalize input (handle empty, null, string, 0)
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

    // Get all captains
    const captains = await Captain.find();
    if (!captains.length) {
      return res.status(404).json({ message: "No captains found" });
    }

    // Update captains with unique nearby locations
    const updates = captains.map((captain) => {
      const randomCoords = addRandomOffset(
        pickuplnglat.lat,
        pickuplnglat.lng,
        1 
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
      pickup: { address: pickup, lat: pickuplnglat.lat, lng: pickuplnglat.lng },
      destination: { address: destination, lat: destinationlnglat.lat, lng: destinationlnglat.lng },
      ridetype: rideType,
      fare,
      distance,
      duration,
      otp: generateOtp(),
      status: "requested",
    });

    await ride.save();

    // create notification for captain (type: rideRequested)
    const notif = await Notification.create({
      ride: ride._id,
      sender: req.user._id,
      senderModel: "User",
      receiver: captainId,
      receiverModel: "Captain",
      type: "rideRequested",
      title: "New Ride Request",
      message: `A user requested a ride from ${pickup} to ${destination}`,
    });

    const sent = sendToCaptain(captainId, "receiveNotification", {
      type: "rideRequested",
      category: "action",
      autoClose: false,
      receiverRole: "captain",

      title: "Ride Requested",
      message: `User requested a ride from ${pickup} to ${destination}`,
      rideId: ride._id,
    });
    if (!sent) console.log("Captain offline, notification saved for later.");

    return res.status(201).json({
      notif,
      ride,
    });
  } catch (error) {
    console.error("Error creating ride:", error);
    return res.status(500).json({ message: "Error creating ride", error: error.message });
  }
};

module.exports.acceptRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    const captainId = req.captain?._id;

    if (!captainId) {
      return res.status(401).json({ message: "Captain authentication failed" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = "accepted";
    ride.captain = captainId;
    await ride.save();

    const userId = ride.user.toString();
    const captain = await Captain.findById(captainId);

    captain.dailyStats.ridesAccepted =
      (captain.dailyStats.ridesAccepted || 0) + 1;
    await captain.save();

    const notif = await Notification.create({
      ride: ride._id,
      sender: captainId,
      senderModel: "Captain",
      receiver: userId,
      receiverModel: "User",
      type: "rideAccepted",
      title: "Ride Accepted",
      message: `Captain ${captain?.name || ""} accepted your ride request!`,
    });

    sendToUser(userId, "receiveNotification", {
      type: "rideAccepted",
      category: "action",
      autoClose: false,
      receiverRole: "user",

      title: "Ride Accepted",
      message: "Captain accepted your ride",
      rideId: ride._id,
    });

    res.json({ success: true, ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Captain rejects
module.exports.rejectRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    const captainId = req.captain?._id;

    if (!captainId) {
      return res.status(401).json({ message: "Captain authentication failed" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = "cancelled";
    await ride.save();

    const captain = await Captain.findById(captainId);
    captain.dailyStats.ridesRejected = (captain.dailyStats.ridesRejected || 0) + 1;
    await captain.save();

    const notifUser = await Notification.create({
      ride: ride._id,
      sender: captainId,
      senderModel: "Captain",
      receiver: ride.user,
      receiverModel: "User",
      type: "RideRejected",
      title: "Ride Rejected",
      message: "Captain rejected the ride",
    });

    sendToUser(ride.user, "receiveNotification", {
      type: "rideRejected",
      category: "info",
      autoClose: true,
      receiverRole: "user",

      title: "Ride Rejected",
      message: "Captain rejected your ride request",
      rideId: ride._id,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.verifyOtp = async (req, res) => {
  try {
    const rideId = req.params.id;
    const { otp } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    else {
      ride.status = "otpVerified";
      await ride.save();
    }

    res.json({ success: true, ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.startRide = async (req, res) => {
  try {
    const rideId = req.params.id || req.body.rideId;
    const captainId = req.body.captainId;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.status = "started";
    ride.startedAt = new Date();
    await ride.save();

    startRideSimulation(ride._id.toString());

    const notifUser = await Notification.create({
      ride: ride._id,
      sender: ride.captain,
      senderModel: "Captain",
      receiver: ride.user,
      receiverModel: "User",
      type: "RideStarted",
      title: "Ride Started",
      message: "Your ride has started",
    });

    sendToUser(ride.user.toString(), "receiveNotification",
      {
        type: "rideStarted",
        category: "info",
        autoClose: true,
        receiverRole: "user",

        title: "Ride Started",
        message: "Your ride has started",
        rideId: ride._id,
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Complete ride
module.exports.completeRide = async (req, res) => {
  try {
    const rideId = req.params.id || req.body.rideId;
    const captainId = req.body.captainId;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.status = "completed";
    await ride.save();

    const captain = await Captain.findById(captainId);
    captain.dailyStats.distanceCovered = (captain.dailyStats.distanceCovered || 0) + ride.distance;
    await captain.save();

    const notifUser = await Notification.create({
      ride: ride._id,
      sender: ride.captain,
      senderModel: "Captain",
      receiver: ride.user,
      receiverModel: "User",
      type: "RideCompleted",
      title: "Ride Completed",
      message: "Ride completed successfully",
    });

    sendToUser(ride.user.toString(), "receiveNotification", {
      type: "rideCompleted",
      category: "info",
      autoClose: true,
      receiverRole: "user",

      title: "Ride Completed",
      message: "Ride completed successfully",
      rideId: ride._id,
    });

    res.json({ success: true, ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// User cancels ride
module.exports.cancelRideByUser = async (req, res) => {
  try {
    const rideId = req.params.id || req.body.rideId;
    const userId = req.user ? req.user._id : req.body.userId;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    // only allow the passenger to cancel
    if (String(ride.user) !== String(userId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    ride.status = 'cancelled';
    await ride.save();

    // notify captain if assigned
    if (ride.captain) {
      const notif = await Notification.create({
        ride: ride._id,
        sender: userId,
        senderModel: 'User',
        receiver: ride.captain,
        receiverModel: 'Captain',
        type: 'RideCancelled',
        title: 'Ride Cancelled',
        message: 'Passenger cancelled the ride',
      });

      sendToCaptain(String(ride.captain), 'receiveNotification', {
        type: 'rideCancelled',
        category: 'info',
        autoClose: true,
        receiverRole: 'captain',
        title: 'Ride Cancelled',
        message: 'Passenger cancelled the ride',
        rideId: ride._id,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error cancelling ride by user:', err);
    res.status(500).json({ message: 'Server error' });
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
      .populate("user", "fullname email")
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
  const { pickuplnglat, destinationlnglat } = req.body;

  try {
    if (
      !pickuplnglat?.lat ||
      !pickuplnglat?.lng ||
      !destinationlnglat?.lat ||
      !destinationlnglat?.lng
    ) {
      console.error("Invalid coordinates:", pickuplnglat, destinationlnglat);
      return res.status(400).json({
        distance: 0,
        duration: 0,
        message: "Invalid coordinates"
      });
    }

    const url = `http://router.project-osrm.org/route/v1/driving/${pickuplnglat.lng},${pickuplnglat.lat};${destinationlnglat.lng},${destinationlnglat.lat}?overview=false`;

    const osrmRes = await axios.get(url);

    if (!osrmRes.data.routes?.length) {
      return res.status(400).json({
        distance: 0,
        duration: 0,
        message: "No route found"
      });
    }

    const route = osrmRes.data.routes[0];

    return res.json({
      distance: +(route.distance / 1000).toFixed(2), // km
      duration: Math.round(route.duration / 60),    // minutes
    });
  } catch (err) {
    console.error("OSRM error:", err.message);
    return res.status(500).json({
      distance: 0,
      duration: 0,
      message: "ETA calculation failed"
    });
  }
}

module.exports.markPaid = async (req, res) => {
  try {
    const rideId = req.params.id;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.payment.status = "paid";
    await ride.save();
    res.json({ success: true, ride });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

