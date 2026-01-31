const express = require("express");
const stripe = require("../config/stripe.js");
const Ride = require("../models/ride.model.js");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { rideId } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.status !== "completed") {
      return res.status(400).json({ message: "Ride not completed yet" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
     amount: Math.max(Math.round(ride.fare * 100), 5000), // minimum ₹50
     currency: "inr",
     metadata: {
      rideId: ride._id.toString(),
     },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment init failed" });
  }
};