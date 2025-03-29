const express = require('express')
const router = express.Router()
const {body} = require("express-validator")
const userController = require('../Controllers/user.controller')
 
router.post('/register', [
 body('email').isEmail().withMessage('Invalid Email'),
 body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
body('password').isLength({min:6}).withMessage('password must be 6 character long')
],
userController.registerUser
)

module.exports = router;
