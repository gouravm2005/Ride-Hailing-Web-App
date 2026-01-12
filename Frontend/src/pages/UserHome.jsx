import { React, useState, useRef, useEffect } from "react";
import Navbar2 from "../components/Navbar2"
import RideType from "../components/RideType"
import Location from "../components/Location"
import AvailableRide from "../components/AvailableRide";
import CaptainDetail from "../components/CaptainDetail";
import MapComponent from "../components/MapComponent";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const UserHome = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [data, setData] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [panelStep, setPanelStep] = useState('suggestions');
  const [selectedRideType, setSelectedRideType] = useState(null);
  const [selectedCaptain, setSelectedCaptain] = useState(null);
  const [isFormCompact, setIsFormCompact] = useState(false);
  const [pickuplnglat, setpickuplnglat] = useState({});
  const [destinationlnglat, setdestinationlnglat] = useState({})

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const panelRef = useRef(null);

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '50%',
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [panelOpen]);

  useEffect(() => {
    if (pickup.trim() !== '' && destination.trim() !== '') {
      setFormFilled(true);
      setIsFormCompact(true);
    } else {
      setFormFilled(false);
      setIsFormCompact(false);
      setPanelStep('suggestions');
    }
  }, [pickup, destination]);


  const requestRide = async () => {
    try {
      const userAuth = JSON.parse(localStorage.getItem("userAuth"));
      if (!userAuth || !userAuth.token) return;

      console.log(pickuplnglat);
      console.log(destinationlnglat);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ride/requestRide`,
        {
          captainId: selectedCaptain,
          pickup,
          destination,
          pickuplnglat,
          destinationlnglat,
          rideType: selectedRideType
        },
        { headers: { Authorization: `Bearer ${userAuth.token}` } }
      );
    const ride = res.data.ride;
    console.log("The ride id is",ride._id);
    navigate("/rideTracking", { state: { rideId: ride._id } });
    } catch (err) {
      console.error("Error:", err);
    }
  }

  const updateCaptainLocation = async (
    pickup,
    pickuplnglat,
    destination,
    destinationlnglat
  ) => {
    try {
      console.log("Sending:", { pickup, pickuplnglat, destination, destinationlnglat });
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ride/updateCaptainLocation`,
        { pickup, pickuplnglat, destination, destinationlnglat }
      );
      console.log("Captains updated:", res.data);
    } catch (err) {
      console.error("Error updating captains:", err);
    }
  };

  // handle suggestion selection
  const handleLocationSelect = (loc) => {
    if (panelStep === "pickup") {
      setPickup(loc.name);
      setpickuplnglat({ lng: loc.lon, lat: loc.lat });
    } else if (panelStep === "destination") {
      setDestination(loc.name);
      setdestinationlnglat({ lng: loc.lon, lat: loc.lat });
    }

    // close suggestion panel
    setPanelStep(null);

    // call backend with all values (including updated one)
    updateCaptainLocation(
      panelStep === "pickup" ? loc.name : pickup,
      panelStep === "pickup" ? { lng: loc.lon, lat: loc.lat } : pickuplnglat,
      panelStep === "destination" ? loc.name : destination,
      panelStep === "destination" ? { lng: loc.lon, lat: loc.lat } : destinationlnglat
    );
  };

  // handle form submit when user typed manually
  const submitHandler = (e) => {
    e.preventDefault();

    console.log("pickup:", pickup);
    console.log("pickuplnglat:", pickuplnglat);
    console.log("destination:", destination);
    console.log("destinationlnglat:", destinationlnglat);

    updateCaptainLocation(pickup, pickuplnglat, destination, destinationlnglat);
  };

  const handleRideSelect = (rideType) => {
    setSelectedRideType(rideType);
    setPanelOpen(true);
    setPanelStep('availableRide');
  };

  const handleCaptainSelect = (capId) => {
    setSelectedCaptain(capId);
    setPanelOpen(true);
    setPanelStep('captainDetail');
  };

  const handleConfirmRide = () => {
    alert('Ride confirmed! Your driver will arrive soon.');
    requestRide();
    // Reset to initial state or navigate to tracking page
  };

  const handleCancelRide = () => {
    setPanelStep('availableRide');
    setSelectedCaptain(null);
  };

  const handleSeeRides = () => {
    if (formFilled) {
      setPanelStep('RideType');
      setPanelOpen(true);
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-50">
      <Navbar2 />

      <div className="h-full w-full flex flex-col md:flex-row">
        {/* Map Section */}

        <div className="h-1/2 md:h-full md:flex-1 relative">
          {pickuplnglat?.lat &&
            pickuplnglat?.lng &&
            destinationlnglat?.lat &&
            destinationlnglat?.lng ? (
            <MapComponent
              showRoute={formFilled}
              pickuplnglat={pickuplnglat}
              destinationlnglat={destinationlnglat}
            />
          ) : (
            <MapComponent />
          )}

        </div>

        {/* Form Section */}
        <div className={`
          w-full md:w-96 bg-white shadow-xl relative z-10
          ${isFormCompact ? 'md:h-[85%] md:mt-8 md:p-3 md:mr-4 border-gray-400 rounded-md' : 'h-1/2 md:h-[85%] md:mt-8 md:p-3 md:mr-4 border-gray-400 rounded-md'}
          transition-all duration-300 ease-in-out
          flex flex-col
        `}>

          {/* Form Header and Inputs */}
          <div className={`
            p-6 md:p-6 bg-white
            ${isFormCompact ? 'border-b border-gray-200' : ''}
            transition-all duration-300
          `}>
            <h3 className={`
              font-bold text-blue-600 mb-4 md:mb-6
              ${isFormCompact ? 'text-3xl' : 'text-3xl md:text-4xl'}
              transition-all duration-300
            `}>
              Find a trip
            </h3>

            <form onSubmit={submitHandler} className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-6 w-1 h-12 bg-gray-300"></div>
                <div className="absolute left-3.5 top-4 w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute left-3.5 top-14 w-2 h-2 bg-red-500 rounded-full"></div>
                <input
                  onFocus={() => setPanelStep("pickup")}
                  className="w-full h-12 rounded-lg bg-gray-100 mb-4 pl-10 pr-4 border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  value={pickup}
                  onChange={(e) => { setPickup(e.target.value), setpickuplnglat({ lng: 0, lat: 0 }) }}
                  type="text"
                  placeholder="Pickup location"
                />

                {panelStep === "pickup" && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto z-50">
                    <Location
                      query={pickup}
                      onLocationSelect={(loc) => {
                        setPickup(loc.name);
                        setpickuplnglat({ lng: loc.lon, lat: loc.lat });
                        setPanelStep(null);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Destination */}
              <div className="relative">
                <input
                  onFocus={() => setPanelStep("destination")}
                  className="w-full h-12 rounded-lg bg-gray-100 pl-10 pr-4 border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  value={destination}
                  onChange={(e) => { setDestination(e.target.value), setdestinationlnglat({ lng: 0, lat: 0 }) }}
                  type="text"
                  placeholder="Destination"
                />

                {panelStep === "destination" && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto z-50">
                    <Location
                      query={destination}
                      onLocationSelect={(loc) => {
                        setDestination(loc.name);
                        setdestinationlnglat({ lng: loc.lon, lat: loc.lat });
                        setPanelStep(null);
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                onClick={handleSeeRides}
                disabled={!formFilled}
                className={`
                  w-full h-12 rounded-lg font-semibold text-white transition-all duration-300
                  ${formFilled
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer transform hover:scale-[1.02]'
                    : 'bg-gray-400 cursor-not-allowed'
                  }
                  ${isFormCompact ? 'text-base' : 'text-lg'}
                `}
              >
                {formFilled ? 'See Rides' : 'Enter pickup & destination'}
              </button>
            </form>
          </div>

          {/* Expandable Panel Content */}
          {!panelOpen && isFormCompact && (
            <div className="flex-1 p-4 bg-gray-50">
              <p className="text-gray-600 text-center">
                Click "See Rides" to view available options
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Panel for Mobile / Side Panel Content */}
      <div
        ref={panelRef}
        className="absolute bottom-0 w-full z-40 bg-white shadow-2xl md:hidden overflow-hidden"
        style={{ height: '0%' }}
      >
        {panelStep === 'suggestions' && (
          <Location onLocationSelect={handleLocationSelect} />
        )}
        {panelStep === 'RideType' && (
          <RideType onSelectRide={handleRideSelect} data={data} panelOpen={() => setPanelOpen(false)} />
        )}
        {panelStep === 'availableRide' && (
          <AvailableRide
            onSelectCaptain={handleCaptainSelect}
            selectedRideType={selectedRideType}
            panelOpen={() => setPanelOpen(false)}
          />
        )}
        {panelStep === 'captainDetail' && (
          <CaptainDetail
            capId={selectedCaptain}
            onConfirm={handleConfirmRide}
            onCancel={handleCancelRide}
          />
        )}
      </div>

      {/* Desktop Panel Content */}
      <div className="hidden md:block">
        {panelOpen && (
          <div className="fixed right-4 top-16 w-[400px] h-[88%] mt-6 bg-white shadow-xl z-30 border-b-2 border-gray-200 rounded-md">
            {panelStep === 'suggestions' && (
              <Location onLocationSelect={handleLocationSelect} />
            )}
            {panelStep === 'RideType' && (
              <RideType onSelectRide={handleRideSelect} data={data} panelOpen={() => setPanelOpen(false)} />
            )}
            {panelStep === 'availableRide' && (
              <AvailableRide
                onSelectCaptain={handleCaptainSelect}
                selectedRideType={selectedRideType}
                panelOpen={() => setPanelOpen(false)}
              />
            )}
            {panelStep === 'captainDetail' && (
              <CaptainDetail
                capId={selectedCaptain}
                onConfirm={handleConfirmRide}
                onCancel={handleCancelRide}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;