// import { Navigation } from 'lucide-react';

// const MapComponent = ({ showRoute, pickup, destination }) => {
//   return (
//     <div className='h-full w-full md:pb-12 flex justify-center items-center'>
//     <div className="h-[90%] w-[90%] bg-cover bg-center border-b rounded-md bg-no-repeat relative bg-[url('https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif')]">
//       <div className="absolute inset-0 bg-black/10"></div>

//       {/* Location markers */}
//       {showRoute && (
//         <div className="absolute inset-0 flex flex-col justify-between p-8">
//           {pickup && (
//             <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg self-start flex items-center space-x-2">
//               <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//               <span className="font-medium">Pickup Location</span>
//             </div>
//           )}
//           {destination && (
//             <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg self-end flex items-center space-x-2">
//               <div className="w-3 h-3 bg-white rounded-full"></div>
//               <span className="font-medium">Destination</span>
//             </div>
//           )}
//           {pickup && destination && (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
//                 <Navigation className="w-5 h-5" />
//                 <span className="font-medium">Route Active</span>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//     </div>
//   );
// };

// export default MapComponent;

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
