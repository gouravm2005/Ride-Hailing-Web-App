const express = require('express')
const router = express.Router()
const {body} = require("express-validator")
const rideController = require('../Controllers/rideController')
const Authmiddleware = require('../middlewares/Auth.middleware')

router.get("/getLocationSuggestions", rideController.getLocationSuggestions);
router.post("/updateCaptainLocation", rideController.updateCaptainLocation);
router.post("/requestRide", Authmiddleware.AuthUser, rideController.requestRide);
router.post("/cancelRide/:id", Authmiddleware.AuthUser, rideController.cancelRideByUser);
router.post("/acceptRide/:id", Authmiddleware.AuthCaptain, rideController.acceptRide);
router.post("/rejectRide/:id", Authmiddleware.AuthCaptain, rideController.rejectRide);
router.post("/verifyOtp/:id", Authmiddleware.AuthCaptain, rideController.verifyOtp);
router.post("/startRide/:id", Authmiddleware.AuthCaptain, rideController.startRide);
router.post("/completeRide/:id", Authmiddleware.AuthCaptain, rideController.completeRide);
router.get("/getAllUserRides", Authmiddleware.AuthUser, rideController.getAllUserRides);
router.get("/getUserRide/:id", rideController.getUserRide);
router.get("/getAllCaptainRides", Authmiddleware.AuthCaptain, rideController.getAllCaptainRides);
router.get("/getCaptainRide/:id", rideController.getCaptainRide);
router.get("/getRideETA", rideController.getRideETA);

module.exports = router;