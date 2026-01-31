const express = require('express')
const router = express.Router()
const {body} = require("express-validator")
const userController = require('../controllers/userController.js')
const Authmiddleware = require('../middlewares/auth.middleware.js')
 
router.post('/register', [
 body('email').isEmail().withMessage('Invalid Email'),
 body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
body('password').isLength({min:6}).withMessage('password must be 6 character long')
],
userController.registerUser
)

router.post('/login', [
 body('email').isEmail().withMessage('Invalid Email'),
 body('password').isLength({min:6}).withMessage('password must be 6 character long')
],
userController.loginUser
)

router.get('/profile', Authmiddleware.AuthUser, userController.getUserProfile)

router.get('/logout', Authmiddleware.AuthUser, userController.logoutUser)

module.exports = router;
