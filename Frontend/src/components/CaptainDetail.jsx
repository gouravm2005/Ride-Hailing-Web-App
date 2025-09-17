import { Star, User, Phone, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainDetail = ({ capId, onConfirm, onCancel }) => {
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const navigate = useNavigate();

useEffect(() => {
  if (!capId || hasFetched.current) return;

  const getCaptain = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/captain/getCaptainDetail/${capId}`
      );

      // Check API response shape
      const captainData = data.captain ? data.captain : data;

      setCaptain(captainData);
      console.log("API returned:", captainData);

      hasFetched.current = true;
    } catch (err) {
      console.error("Error fetching captain detail:", err);
    } finally {
      setLoading(false);
    }
  };

  getCaptain();
}, [capId]);

// Watch captain updates
useEffect(() => {
  if (captain) {
    console.log("Captain state updated:", captain);
  }
}, [captain]);

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: '💵' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI Payment', icon: '📱' },
    { id: 'wallet', name: 'Wallet', icon: '👛' }
  ];

  return (
    <div className="bg-white p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Trip Details</h3>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Captain Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>

          <div className="flex-1">
            {/* 🔧 FIXED: ensure text is always visible on all screens by removing any responsive-hidden behavior */}
            <h4 className="font-bold text-lg text-gray-900">
              {captain?.fullname?.firstname || "Captain"}
            </h4>

            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {captain?.rideStats?.rating ?? "N/A"}
              </span>
              <span className="text-sm text-gray-400">
                ({captain?.rideStats?.totalRides ?? 0} trips)
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-1">
              {captain?.vehicle?.name || "Vehicle Info Unavailable"}
            </p>
          </div>

          <button className="p-3 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
            <Phone className="w-5 h-5 text-green-600" />
          </button>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h5 className="font-semibold text-gray-800 mb-3">Vehicle Information</h5>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{captain?.vehicle?.name || "Unknown"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Number:</span>
            <span className="font-medium">{captain?.vehicle?.plate || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Distance:</span>
            <span className="font-medium">0.2km away</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Arrival Time:</span>
            <span className="font-medium">2 min</span>
          </div>
        </div>
      </div>

      {/* Trip Info */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h5 className="font-semibold text-gray-800 mb-3">Trip Information</h5>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Pickup Location</p>
              <p className="font-medium">{captain?.pickup || "pickup"}</p>
            </div>
          </div>
          <div className="w-px h-6 bg-gray-300 ml-1.5"></div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Drop Location</p>
              <p className="font-medium">{captain?.destination || "destination"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h5 className="font-semibold text-gray-800 mb-3">Payment Method</h5>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedPayment === method.id}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="mr-3"
              />
              <span className="text-lg mr-3">{method.icon}</span>
              <span className="font-medium">{method.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">Total Fare</span>
          <span className="text-2xl font-bold text-blue-600">₹100</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">Including taxes and fees</p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Confirm Ride
        </button>
      </div>
    </div>
  );
};

export default CaptainDetail;