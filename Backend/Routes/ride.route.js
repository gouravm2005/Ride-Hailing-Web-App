const express = require('express')
const router = express.Router()
const {body} = require("express-validator")
const rideController = require('../Controllers/rideController')
const Authmiddleware = require('../middlewares/Auth.middleware')

router.get("/getLocationSuggestions", rideController.getLocationSuggestions);
router.post("/updateCaptainLocation", rideController.updateCaptainLocation);

module.exports = router;