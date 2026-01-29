const Captain = require("../models/captain.model");
const Ride = require("../models/ride.model");
const { sendToRideRoom } = require("../Socket/socketManager");

const ACTIVE_RIDES = new Map();

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function moveTowards(from, to, km) {
  const dist = haversine(from.lat, from.lng, to.lat, to.lng);
  if (dist === 0) return from;

  const ratio = km / dist;
  return {
    lat: from.lat + (to.lat - from.lat) * ratio,
    lng: from.lng + (to.lng - from.lng) * ratio
  };
}


const axios = require("axios");

async function startRideSimulation(rideId) {
  if (ACTIVE_RIDES.has(rideId)) return;

  console.log("🚀 Simulation started:", rideId);

  const INTERVAL = 2000; // ms, update every 2 seconds

  const ride = await Ride.findById(rideId);
  const captain = await Captain.findById(ride.captain);
  if (!ride || !captain) return;

  // Fetch the route polyline from the same API as frontend
  let routePoints = [];
  try {
    const routeRes = await axios.get(`${process.env.BASE_URL || "http://localhost:4000"}/api/map/getroute`, {
      params: {
        pickupLat: ride.pickup.lat,
        pickupLng: ride.pickup.lng,
        destLat: ride.destination.lat,
        destLng: ride.destination.lng,
      },
      timeout: 10000
    });
    let coords = [];
    if (routeRes.data?.routes?.length) {
      coords = routeRes.data.routes[0].geometry.coordinates;
    } else if (routeRes.data?.geometry?.coordinates) {
      coords = routeRes.data.geometry.coordinates;
    } else if (routeRes.data?.coordinates) {
      coords = routeRes.data.coordinates;
    }
    // Convert [lng, lat] to [lat, lng] and ensure all points are [lat, lng] consistently
    routePoints = coords.map(pt => {
      if (Array.isArray(pt) && pt.length === 2) {
        // If both numbers, and in India (lat ~ 8-37, lng ~ 68-97)
        // If first is > 50, it's likely lng, so swap
        if (pt[0] > 50 && pt[1] >= 8 && pt[1] <= 37) {
          // [lng, lat] -> [lat, lng]
          return [Number(pt[1]), Number(pt[0])];
        }
        // If first is in lat range, keep as is
        return [Number(pt[0]), Number(pt[1])];
      }
      return pt;
    });
  } catch (err) {
    console.error("Failed to fetch route polyline for ride simulation", err.message);
    // fallback: straight line
    routePoints = [
      [ride.pickup.lat, ride.pickup.lng],
      [ride.destination.lat, ride.destination.lng]
    ];
  }

  // Calculate total steps based on ride duration (in minutes)
  const durationMin = ride.duration || 10; // fallback 10 min
  const totalSteps = Math.max(2, Math.floor((durationMin * 60) / (INTERVAL / 1000)));

  // Interpolate points along the polyline for smooth movement
  function interpolateRoutePoints(points, steps) {
    if (points.length < 2) return points;
    // Calculate total length
    let totalDist = 0;
    const segLens = [];
    for (let i = 1; i < points.length; i++) {
      const seg = haversine(points[i-1][0], points[i-1][1], points[i][0], points[i][1]);
      segLens.push(seg);
      totalDist += seg;
    }
    // Place steps evenly along the route
    const stepDist = totalDist / (steps - 1);
    const result = [points[0]];
    let currSeg = 0, currDist = 0, accDist = 0;
    for (let s = 1; s < steps - 1; s++) {
      const targetDist = s * stepDist;
      while (currSeg < segLens.length && accDist + segLens[currSeg] < targetDist) {
        accDist += segLens[currSeg];
        currSeg++;
      }
      if (currSeg >= segLens.length) break;
      const segStart = points[currSeg];
      const segEnd = points[currSeg + 1];
      const segLen = segLens[currSeg];
      const remain = targetDist - accDist;
      const ratio = segLen === 0 ? 0 : remain / segLen;
      const lat = segStart[0] + (segEnd[0] - segStart[0]) * ratio;
      const lng = segStart[1] + (segEnd[1] - segStart[1]) * ratio;
      result.push([lat, lng]);
    }
    result.push(points[points.length - 1]);
    return result;
  }

  const simPoints = interpolateRoutePoints(routePoints, totalSteps);


  // Start from pickup (store as [lng, lat] for GeoJSON, but always emit { lat, lng })
  // Defensive logging
  console.log("[SIM] Initial pickup position:", ride.pickup.lat, ride.pickup.lng);
  captain.location.coordinates = [ride.pickup.lng, ride.pickup.lat];
  await captain.save();
  // Emit initial position at pickup
  sendToRideRoom(rideId, "captainLocationUpdate", { lat: ride.pickup.lat, lng: ride.pickup.lng });
  console.log("[SIM] Emitting captainLocationUpdate (pickup):", { lat: ride.pickup.lat, lng: ride.pickup.lng });


  let step = 0;
  const interval = setInterval(async () => {
    const freshRide = await Ride.findById(rideId);
    if (!freshRide || !["started", "ongoing"].includes(freshRide.status)) {
      clearInterval(interval);
      ACTIVE_RIDES.delete(rideId);
      return;
    }

    if (step >= simPoints.length) {
      // Complete ride
      freshRide.status = "completed";
      freshRide.completedAt = new Date();
      await freshRide.save();
      sendToRideRoom(rideId, "rideCompleted", freshRide);
      clearInterval(interval);
      ACTIVE_RIDES.delete(rideId);
      return;
    }

    // simPoints: [lat, lng] arrays
    const [lat, lng] = simPoints[step];
    // Defensive logging
    console.log(`[SIM] Step ${step}: Emitting captainLocationUpdate`, { lat, lng });
    // Store as [lng, lat] for GeoJSON, emit as { lat, lng }
    captain.location.coordinates = [lng, lat];
    await captain.save();
    // Only emit if lat/lng are in valid India bounds (lat: 8-37, lng: 68-97)
    if (
      typeof lat === 'number' && typeof lng === 'number' &&
      lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97
    ) {
      sendToRideRoom(rideId, "captainLocationUpdate", { lat, lng });
    } else {
      console.warn(`[SIM] Skipping invalid coordinate:`, { lat, lng });
    }
    step++;
  }, INTERVAL);

  ACTIVE_RIDES.set(rideId, interval);
}

module.exports = { startRideSimulation };
