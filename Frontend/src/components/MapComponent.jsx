import { Navigation } from 'lucide-react';

const MapComponent = ({ showRoute, pickup, destination }) => {
  return (
    <div className="h-full w-full bg-cover bg-center bg-no-repeat relative bg-[url('https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif')]">
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Location markers */}
      {showRoute && (
        <div className="absolute inset-0 flex flex-col justify-between p-8">
          {pickup && (
            <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg self-start flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-medium">Pickup Location</span>
            </div>
          )}
          {destination && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg self-end flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="font-medium">Destination</span>
            </div>
          )}
          {pickup && destination && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
                <Navigation className="w-5 h-5" />
                <span className="font-medium">Route Active</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapComponent;