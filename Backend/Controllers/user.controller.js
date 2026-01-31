const userService = require('../Services/user.service.js');
const userModel = require('../Models/user.model.js')
const {validationResult} = require('express-validator');
const blacklistTokenModel = require('../Models/blacklistToken.model.js');

module.exports.registerUser = async(req, res, next) => {

 const errors = validationResult(req);
 if(!errors.isEmpty()) {
  return res.status(400).json({errors:errors.array()});
 }

 const { fullname, email, password } = req.body;

 const isUserAlreadyExist = await userModel.findOne({email});

 if(isUserAlreadyExist){
  return res.status(400).json({message: 'User already exist'});
 }

 const hashedPassword = await userModel.hashPassword(password);

 const user = await userService.createUser({
  firstname:fullname.firstname,
  lastname:fullname.lastname,
  email,
  password : hashedPassword
 });

 const token = user.generateAuthToken();

 res.status(201).json({ token, user});
}

module.exports.loginUser = async(req, res, next) => {
 const errors = validationResult(req);
 if(!errors.isEmpty()) {
  return res.status(400).json({errors:errors.array()});
 }

 const {email, password} = req.body;

 const user = await userModel.findOne({email}).select('+password');

 if(!user){
  return res.status(401).json({message:'Invalid Email and password'})
 }

 const isMatch = await user.comparePassword(password);

 if(!isMatch){
  return res.status(401).json({message:'Invalid Email and password'});
 }

 const token = user.generateAuthToken();

 res.status(201).json({ token, user});
}

module.exports.getUserProfile = async (req, res, next) => {
//  res.status(200).json(req.user);
 try {
    const user = await userModel.findById(req.user._id).select("-password");
     console.log(user);
    res.json({
      firstname: user.fullname.firstname,
      lastname: user.fullname.lastname,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie('token');
  const token = req.cookies.token || req.headers.authorization.split(' ')[1];

  await blacklistTokenModel.create({ token });

  res.status(200).json({ message: 'Logged out'});
}