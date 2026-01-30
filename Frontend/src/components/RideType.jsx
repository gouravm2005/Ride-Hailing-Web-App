import { Car, Bike, Truck, CheckCircle } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

const RideType = ({ onSelectRide, data, panelOpen }) => {
  const rideTypes = [
    {
      id: 'bike',
      name: 'bike',
      icon: <Bike className="w-8 h-8" />,
      price: 10,
      time: '2-5 min',
      description: 'Affordable rides on two wheels'
    },
    {
      id: 'auto',
      name: 'auto',
      icon: <Truck className="w-8 h-8" />,
      price: 15,
      time: '3-8 min',
      description: 'Quick and comfortable auto rides'
    },
    {
      id: 'car',
      name: 'car',
      icon: <Car className="w-8 h-8" />,
      price: 20,
      time: '5-12 min',
      description: 'Premium car rides with AC'
    }
  ];

  return (
    <div className="bg-white pl-6 pr-6 mt-16 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Choose a Ride</h3>
        <span className="text-sm text-gray-500">
          {data?.pickup ? `From ${data.pickup.slice(0, 20)}...` : ''}
        </span>
      </div>

      <div className="space-y-3">
        {rideTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => onSelectRide && onSelectRide(type.name)}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
              {type.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{type.name}</h4>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{type.price}<span className="text-sm text-gray-500"> per km</span></p>
                  <p className="text-sm text-gray-500">{type.time}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{type.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-blue-700">
          <CheckCircle className="w-4 h-4" />
          <span>All rides include GPS tracking and 24/7 support</span>
        </div>
      </div>
        {panelOpen && (
            <div className="w-8 h-8 absolute top-3 z-50">
              <button
                onClick={panelOpen}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-blue-600" />
              </button>
            </div>
          )}
    </div>
  );
};

export default RideType;