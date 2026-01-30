import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { carIcon } from "../utils/carIcon";
import "leaflet/dist/leaflet.css";

const FitBounds = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points?.length > 1) {
      map.fitBounds(points, { padding: [60, 60] });
    }
  }, [points, map]);

  return null;
};

const MapComponent = ({ pickuplnglat, destinationlnglat, captainPos, rideStatus }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (!pickuplnglat || !destinationlnglat) return;
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/map/getroute`, {
        params: {
          pickupLat: pickuplnglat.lat,
          pickupLng: pickuplnglat.lng,
          destLat: destinationlnglat.lat,
          destLng: destinationlnglat.lng,
        },
      })
      .then((res) => {
        let coords = [];
        if (res.data?.routes?.length) {
          coords = res.data.routes[0].geometry.coordinates;
        } else if (res.data?.geometry?.coordinates) {
          coords = res.data.geometry.coordinates;
        } else if (res.data?.coordinates) {
          coords = res.data.coordinates;
        }
      
        const formatted = coords
          .map((pt) => {
            if (Array.isArray(pt) && pt.length === 2) {
              if (pt[0] > 50 && pt[1] >= 8 && pt[1] <= 37) {
                // [lng, lat] -> [lat, lng]
                return [Number(pt[1]), Number(pt[0])];
              }
            
              return [Number(pt[0]), Number(pt[1])];
            }
            return pt;
          })
          .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));
        setRoute(formatted);
      })
      .catch((err) => console.error("Route error:", err));
  }, [pickuplnglat, destinationlnglat]);

  // Center always on pickup
  const center = useMemo(() => {
    if (pickuplnglat?.lat) {
      return [pickuplnglat.lat, pickuplnglat.lng];
    }
    return [28.7041, 77.1025];
  }, [pickuplnglat]);

  let captainPosition = pickuplnglat;
  if (rideStatus === "started" && captainPos && captainPos.lat && captainPos.lng) {
    captainPosition = captainPos;
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Pickup marker */}
        {pickuplnglat?.lat && (
          <Marker position={[pickuplnglat.lat, pickuplnglat.lng]} />
        )}

        {/* Destination marker */}
        {destinationlnglat?.lat && (
          <Marker position={[destinationlnglat.lat, destinationlnglat.lng]} />
        )}

        {/* Route polyline */}
        {route.length > 0 && (
          <Polyline positions={route} pathOptions={{ color: "#2563eb", weight: 5 }} />
        )}

        {/* Captain car marker (moves only as backend emits new positions) */}
        {captainPosition?.lat && captainPosition?.lng && (
          <Marker position={[captainPosition.lat, captainPosition.lng]} icon={carIcon} />
        )}

        {/* Fit bounds to pickup/destination for best accuracy */}
        {pickuplnglat?.lat && destinationlnglat?.lat && (
          <FitBounds points={[[pickuplnglat.lat, pickuplnglat.lng], [destinationlnglat.lat, destinationlnglat.lng]]} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
