import React from "react";
import {useLocation} from 'react-router-dom';
import Navbar1 from "../components/Navbar1";
import Navbar2 from "../components/Navbar2";

export default function Support() {
  const location = useLocation();
  const from = location.state?.from;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {from === "Navbar1" ? <Navbar1 /> : <Navbar2 />}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Support & Help
        </h1>

        <p className="text-gray-600 mb-6">
          Need help with your ride, account, or payments? We’re here to assist
          you. Check the common issues below or reach out to us.
        </p>

        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          ❓ Common Issues
        </h2>

        <div className="space-y-4 text-gray-600 mb-6">
          <div>
            <strong>Ride not accepted?</strong>
            <p>
              Please wait a few moments while nearby captains respond. You can
              cancel and request again if needed.
            </p>
          </div>

          <div>
            <strong>Captain went offline?</strong>
            <p>
              Captains can toggle availability. If a captain disconnects, you’ll
              be notified automatically.
            </p>
          </div>

          <div>
            <strong>Payment issues?</strong>
            <p>
              Payments are processed securely. If a payment fails, try again or
              choose a different method.
            </p>
          </div>

          <div>
            <strong>Incorrect ride status?</strong>
            <p>
              Refresh the page or wait for real-time updates via notifications.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          📞 Contact Support
        </h2>

        <div className="text-gray-600 space-y-2">
          <p>
            <strong>Email:</strong> support@rideapp.com
          </p>
          <p>
            <strong>Phone:</strong> +91-XXXXXXXXXX
          </p>
          <p>
            <strong>Availability:</strong> 24×7 Support
          </p>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          For urgent issues during an active ride, please use in-app
          notifications or cancel the ride safely.
        </div>
      </div>
    </div>
  );
}
