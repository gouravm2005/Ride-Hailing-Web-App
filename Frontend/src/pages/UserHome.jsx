import { React, useState, useRef, useEffect } from "react";
import Navbar2 from "../components/Navbar2"
import RideType from "../components/RideType"
import Location from "../components/Location"
import AvailableRide from "../components/AvailableRide";
import CaptainDetail from "../components/CaptainDetail";
import MapComponent from "../components/MapComponent";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ArrowLeft,
} from 'lucide-react';

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

  const panelRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
    setData({
      pickup: pickup,
      destination: destination
    });
  };

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

  // const handleLocationSelect = (location) => {
  //   // Logic to set pickup or destination based on which field was last focused
  //   if (!pickup) {
  //     setPickup(location.name);
  //   } else if (!destination) {
  //     setDestination(location.name);
  //   }
  // };

  const handleRideSelect = (rideType) => {
    setSelectedRideType(rideType);
    setPanelStep('availableRide');
  };

  const handleCaptainSelect = (email) => {
    setSelectedCaptain(email);
    setPanelStep('captainDetail');
  };

  const handleConfirmRide = () => {
    alert('Ride confirmed! Your driver will arrive soon.');
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
          <MapComponent
            showRoute={formFilled}
            pickup={pickup}
            destination={destination}
          />
        </div>

        {/* Form Section */}
        <div className={`
          w-full md:w-96 bg-white shadow-2xl relative z-10
          ${isFormCompact ? 'h-auto' : 'h-1/2 md:h-full'}
          transition-all duration-300 ease-in-out
          flex flex-col
        `}>
          {/* Back button for mobile when panel is open */}
          {panelOpen && (
            <div className="absolute top-4 left-4 z-50 md:hidden">
              <button
                onClick={() => setPanelOpen(false)}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-blue-600" />
              </button>
            </div>
          )}

          {/* Form Header and Inputs */}
          <div className={`
            p-4 md:p-6 bg-white
            ${isFormCompact ? 'border-b border-gray-200' : ''}
            transition-all duration-300
          `}>
            <h3 className={`
              font-bold text-blue-600 mb-4 md:mb-6
              ${isFormCompact ? 'text-xl' : 'text-3xl md:text-4xl'}
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
                  onChange={(e) => setPickup(e.target.value)}
                  type="text"
                  placeholder="Pickup location"
                />

                {panelStep === "pickup" && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto z-50">
                    <Location onLocationSelect={(loc) => {
                      setPickup(loc.name);
                      setPanelStep(null);
                    }} />
                  </div>
                )}
              </div>

              {/* Destination */}
              <div className="relative">
                <input
                  onFocus={() => setPanelStep("destination")}
                  className="w-full h-12 rounded-lg bg-gray-100 pl-10 pr-4 border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  type="text"
                  placeholder="Destination"
                />

                {panelStep === "destination" && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto z-50">
                    <Location onLocationSelect={(loc) => {
                      setDestination(loc.name);
                      setPanelStep(null);
                    }} />
                  </div>
                )}
              </div>

              <button
                type="button"
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
        {/* {panelStep === 'suggestions' && (
          <Location onLocationSelect={handleLocationSelect} />
        )} */}
        {panelStep === 'RideType' && (
          <RideType onSelectRide={handleRideSelect} data={data} />
        )}
        {panelStep === 'availableRide' && (
          <AvailableRide
            onSelectCaptain={handleCaptainSelect}
            selectedRideType={selectedRideType}
          />
        )}
        {panelStep === 'captainDetail' && (
          <CaptainDetail
            email={selectedCaptain}
            onConfirm={handleConfirmRide}
            onCancel={handleCancelRide}
          />
        )}
      </div>

      {/* Desktop Panel Content */}
      <div className="hidden md:block">
        {panelOpen && (
          <div className="fixed right-0 top-14 w-96 h-[calc(100vh-3.5rem)] bg-white shadow-2xl z-30 border-l border-gray-200">
            {panelStep === 'suggestions' && (
              <Location onLocationSelect={handleLocationSelect} />
            )}
            {panelStep === 'RideType' && (
              <RideType onSelectRide={handleRideSelect} data={data} />
            )}
            {panelStep === 'availableRide' && (
              <AvailableRide
                onSelectCaptain={handleCaptainSelect}
                selectedRideType={selectedRideType}
              />
            )}
            {panelStep === 'captainDetail' && (
              <CaptainDetail
                email={selectedCaptain}
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