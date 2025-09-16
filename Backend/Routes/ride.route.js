const express = require('express')
const router = express.Router()
const {body} = require("express-validator")
const rideController = require('../Controllers/rideController')
const Authmiddleware = require('../middlewares/Auth.middleware')

router.get("/getLocationSuggestions", rideController.getLocationSuggestions);
router.post("/updateCaptainLocation", rideController.updateCaptainLocation);
router.post("/requestRide", Authmiddleware.AuthUser, rideController.requestRide);
router.get("/getAllUserRides", Authmiddleware.AuthUser, rideController.getAllUserRides);
router.get("/getUserRide/:id", rideController.getUserRide);
router.get("/getAllCaptainRides", Authmiddleware.AuthCaptain, rideController.getAllCaptainRides);
router.get("/getCaptainRide/:id", rideController.getCaptainRide);

module.exports = router;