import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ rideId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [method, setMethod] = useState("card");

  const markRidePaid = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/markPaid/${rideId}`);
      navigate("/UserHome");
    } catch (err) {
      setError("Payment succeeded but failed to update ride status.");
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Only card is supported
      if (method !== "card") {
        setError("Only card payments are supported in this demo.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/payment/create-payment-intent`,
        { rideId }
      );

      const result = await stripe.confirmCardPayment(
        res.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
        await markRidePaid();
      } else {
        setError("Payment failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Complete Your Payment</h2>
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded border ${method === "card" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setMethod("card")}
          >
            Card
          </button>
          <button
            className={`px-4 py-2 rounded border ${method === "upi" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setMethod("upi")}
            disabled
          >
            UPI (Coming Soon)
          </button>
          <button
            className={`px-4 py-2 rounded border ${method === "netbanking" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setMethod("netbanking")}
            disabled
          >
            Netbanking (Coming Soon)
          </button>
        </div>
        {method === "card" && (
          <form onSubmit={handlePay} className="space-y-6">
            <div className="border rounded p-4 bg-gray-50">
              <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
            </div>
            {error && <div className="text-red-600 text-center">{error}</div>}
            <button
              type="submit"
              disabled={!stripe || loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        )}
        {success && (
          <div className="text-green-600 text-center mt-4 font-semibold">
            Payment Successful! Redirecting...
          </div>
        )}
      </div>
    </div>
  );
};

const Payment = () => {
  const location = useLocation();
  const rideId = location.state?.rideId || location.state;
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm rideId={rideId} />
    </Elements>
  );
};

export default Payment;
