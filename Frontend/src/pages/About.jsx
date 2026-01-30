import React from "react";
import {useLocation} from 'react-router-dom';
import Navbar1 from "../components/Navbar1";
import Navbar2 from "../components/Navbar2";

export default function About() {
  const location = useLocation();
  const from = location.state?.from;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {from === "Navbar1" ? <Navbar1 /> : <Navbar2 />}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          About Our Ride-Hailing Platform
        </h1>

        <p className="text-gray-600 mb-6">
          Our platform connects passengers with nearby captains for fast,
          reliable, and affordable rides. Built with modern web technologies,
          it focuses on real-time tracking, secure payments, and seamless
          communication between users and captains.
        </p>

        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          🚗 What We Offer
        </h2>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>Instant ride booking with nearby captains</li>
          <li>Real-time ride tracking and notifications</li>
          <li>Secure authentication for users and captains</li>
          <li>Ride status updates (requested, accepted, started, completed)</li>
          <li>Transparent distance & fare estimation</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          👥 Built For
        </h2>
        <p className="text-gray-600 mb-6">
          <strong>Users</strong> who need quick and reliable transportation, and
          <strong> Captains</strong> who want flexible earning opportunities
          with real-time ride management.
        </p>

        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          🌍 Our Vision
        </h2>
        <p className="text-gray-600">
          To create a scalable, efficient, and user-friendly ride-hailing
          experience powered by real-time systems and clean architecture.
        </p>
      </div>
    </div>
  );
}
