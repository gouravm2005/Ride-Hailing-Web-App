const axios = require('axios');
const fetch = require("node-fetch");
const Captain = require('../Models/captain.model')
const ride = require('../Models/ride.model')

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

module.exports.updateCaptainLocation = async (req, res) => {
  try {
    const { pickup, pickuplnglat, destination, destinationlnglat } = req.body;

    if (!pickup || !pickuplnglat || !destination || !destinationlnglat) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Get all captains
    const captains = await Captain.find();

    if (!captains.length) {
      return res.status(404).json({ message: "No captains found" });
    }

    // Example offsets (in km → [north, east])
    const offsets = [
      [0.3, 0],   // 0.3 km north
      [0, 0.8],   // 0.8 km east
      [-1, 0],    // 1 km south
      [0.5, -0.5] // 0.7 km SW
    ];

    // Update each captain with pickup & destination
    const updates = captains.map((captain, idx) => {
      const offset = offsets[idx % offsets.length]; // cycle if more captains
      const [lng, lat] = offsetCoords(
        parseFloat(pickuplnglat.lat),
        parseFloat(pickuplnglat.lng),
        offset[0],
        offset[1]
      );

      return Captain.findByIdAndUpdate(
        captain._id,
        {
          pickup,
          pickupCoordinates: {
            type: "Point",
            coordinates: [parseFloat(pickuplnglat.lng), parseFloat(pickuplnglat.lat)],
          },
          destination,
          destinationCoordinates: {
            type: "Point",
            coordinates: [parseFloat(destinationlnglat.lng), parseFloat(destinationlnglat.lat)],
          },
          location: {
            type: "Point",
            coordinates: [lng, lat], // slightly offset location
          },
        },
        { new: true }
      );
    });

    const updatedCaptains = await Promise.all(updates);

    res.status(200).json({
      message: "Captains updated with pickup, destination, and nearby locations",
      captains: updatedCaptains,
    });
  } catch (error) {
    console.error("Error updating captains:", error);
    res.status(500).json({ message: "Server error" });
  }
};