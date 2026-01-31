const express = require('express')
const router = express.Router()
const { body } = require("express-validator")
const captainController = require('../Controllers/captain.controller.js')
const Authmiddleware = require('../middlewares/Auth.middleware.js')

router.post('/register', [
 body('email').isEmail().withMessage('Invalid Email'),
 body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
 body('password').isLength({min:6}).withMessage('password must be 6 character long'),
 body('vehicle.color').isLength({min: 3}).withMessage('Color must be at least 3 character long'),
 body('vehicle.plate').isLength({min: 3}).withMessage('Color must be at least 3 character long'),
 body('vehicle.capacity').isInt({min:1}).withMessage('Capacity must be at least 1'),
 body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid'),
 
 captainController.registerCaptain

])

router.post('/login', [
 body('email').isEmail().withMessage('Invalid Email'),
 body('password').isLength({min:6}).withMessage('password must be 6 character long')
],
captainController.loginCaptain
)

router.get('/getAvailableCaptain',captainController.getAvailableCaptain)

router.get('/getCaptainDetail/:captainId', captainController.getCaptainDetail)

router.get('/profile', Authmiddleware.AuthCaptain, captainController.getCaptainProfile)

router.get('/logout', Authmiddleware.AuthCaptain, captainController.logoutCaptain)

router.post('/getCaptainETA', Authmiddleware.AuthCaptain, captainController.getCaptainETA);

router.post("/update-captain-status", Authmiddleware.AuthCaptain, captainController.updateCaptainStatus);

module.exports = router;