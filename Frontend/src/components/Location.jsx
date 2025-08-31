// import React from 'react'

// const Location = () => {
//   return (
//     <div className='w-full h-full bg-white text-blue-500 flex flex-col gap-5'>

//      <div className='w-[90%] h-20 flex p-5 gap-5'>
//       <div className='bg-slate-300 mt-2 p-2 rounded-2xl h-10 '><img src='location.svg'></img></div>
//       <div className='flex flex-col'>
//        <h2 className='text-xl font-semibold'>MP Nagar Zone-1</h2>
//        <h4>Bhopal Madhaya pradesh</h4>
//       </div>
//      </div>

//       <div className='w-[90%] h-20 flex p-5 gap-5'>
//       <div className='bg-slate-300 mt-2 p-2 rounded-2xl h-10 '><img src='location.svg'></img></div>
//       <div className='flex flex-col'>
//        <h2 className='text-xl font-semibold'>MP Nagar Zone-1</h2>
//        <h4>Bhopal Madhaya pradesh</h4>
//       </div>
//      </div>

//       <div className='w-[90%] h-20 flex p-5 gap-5'>
//       <div className='bg-slate-300 mt-2 p-2 rounded-2xl h-10 '><img src='location.svg'></img></div>
//       <div className='flex flex-col'>
//        <h2 className='text-xl font-semibold'>MP Nagar Zone-1</h2>
//        <h4>Bhopal Madhaya pradesh</h4>
//       </div>
//      </div>

//       <div className='w-[90%] h-20 flex p-5 gap-5'>
//       <div className='bg-slate-300 mt-2 p-2 rounded-2xl h-10 '><img src='location.svg'></img></div>
//       <div className='flex flex-col'>
//        <h2 className='text-xl font-semibold'>MP Nagar Zone-1</h2>
//        <h4>Bhopal Madhaya pradesh</h4>
//       </div>
//      </div>

//       <div className='w-[90%] h-20 flex p-5 gap-5'>
//       <div className='bg-slate-300 mt-2 p-2 rounded-2xl h-10 '><img src='location.svg'></img></div>
//       <div className='flex flex-col'>
//        <h2 className='text-xl font-semibold'>MP Nagar Zone-1</h2>
//        <h4>Bhopal Madhaya pradesh</h4>
//       </div>
//      </div>

//     </div>
//   )
// }

// export default Location

// --------------------------------------------------------------------------------------------------------------------------
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";

const Location = ({ query, onLocationSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  const mockSuggestions = [
    { id: 1, name: "Central Park Mall", address: "123 Main St, Downtown", distance: "0.5 km" },
    { id: 2, name: "City Airport", address: "Airport Road, Terminal 1", distance: "12.3 km" },
    { id: 3, name: "Business District", address: "Corporate Plaza, Sector 5", distance: "3.2 km" },
    { id: 4, name: "University Campus", address: "Education Hub, Block A", distance: "5.8 km" },
    { id: 5, name: "Shopping Center", address: "Commerce Street, Mall Road", distance: "2.1 km" }
  ];

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
    } else {
      setSuggestions(mockSuggestions); // later -> replace with API results
    }
  }, [query]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto">
      {mockSuggestions.map((location) => (
        <div
          key={location.id}
          onClick={() => onLocationSelect && onLocationSelect(location)}
          className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{location.name}</h4>
            <p className="text-sm text-gray-500">{location.address}</p>
          </div>
          <span className="text-sm text-gray-400">{location.distance}</span>
        </div>
      ))}
    </div>
  );
};

export default Location;