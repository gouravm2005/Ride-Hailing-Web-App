import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds);
  }, [bounds, map]);
  return null;
};

const MapComponent = ({ pickuplnglat, destinationlnglat }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (pickuplnglat && destinationlnglat) {
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
        const coords = res.data.coordinates || res.data.geometry.coordinates;
        setRoute(coords);
        })
        .catch((err) => console.error("Route error:", err));
    }
  }, [pickuplnglat, destinationlnglat]);

  const hasLocations = pickuplnglat && destinationlnglat;
  const center = hasLocations
    ? pickuplnglat
    : { lat: 28.7041, lng: 77.1025 }; // default Delhi center

    
  const bounds =
    route.length > 0 ? [pickuplnglat, destinationlnglat] : null;

  return (
    <div className="h-full w-full md:pb-12 flex justify-center items-center">
      <div className="h-[90%] w-[90%] border-b rounded-md overflow-hidden shadow-md">
        <MapContainer
          center={center}
          zoom={12}
          className="h-full w-full"
        >
  
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Show markers only if coords exist */}
          {pickuplnglat && <Marker position={[pickuplnglat.lat, pickuplnglat.lng]} />}
           {destinationlnglat && (
            <Marker position={[destinationlnglat.lat, destinationlnglat.lng]} />
          )}

          {/* Show route if available */}
          {hasLocations && route.length > 0 && (
            <Polyline positions={route} color="blue" />
          )}
           {bounds && <FitBounds bounds={bounds} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
