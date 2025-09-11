import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const Location = ({ query, onLocationSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/ride/getLocationSuggestions?query=${query}`
        )
        // const data = await res.json();
        setSuggestions(res.data.suggestions || []);
       
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    fetchSuggestions();
  }, [query]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto">
      {suggestions.map((location, idx) => (
        <div
          key={idx}
          onClick={() => onLocationSelect && onLocationSelect(location)}
          className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            {/* OSM response uses `name` instead of `description` */}
            <h4 className="font-medium text-gray-900">{location.name}</h4>
            {/* optional: show coordinates for debugging */}
            <p className="text-xs text-gray-500">
              {location.lat}, {location.lon}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Location;