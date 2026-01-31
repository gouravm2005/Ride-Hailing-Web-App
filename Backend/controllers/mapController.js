// controllers/mapController.js
const axios = require("axios");

module.exports.getRoute = async (req, res) => {
  try {
    const { pickupLat, pickupLng, destLat, destLng } = req.query;

    // If no pickup/destination -> return default empty map
    if (!pickupLat || !pickupLng || !destLat || !destLng) {
      return res.json({ message: "No route, just base map" });
    }

    // Call OSRM public API
    const url = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${destLng},${destLat}?overview=full&geometries=geojson`;

    const response = await axios.get(url);

    const coordinates = response.data.routes[0].geometry.coordinates.map(coord => [
      coord[1], // lat
      coord[0], // lng
    ]);

    res.json({ coordinates });
  } catch (err) {
    console.error("OSRM error:", err.message);
    res.status(500).json({ error: "Failed to fetch route" });
  }
};