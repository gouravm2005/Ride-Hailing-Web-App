const captainModel = require('../Models/captain.model')
const captainService = require('../Services/captain.service')
const { validationResult } = require('express-validator')
const blacklistTokenModel = require('../Models/blacklistToken.model')


module.exports.registerCaptain = async (req, res, next) => {

   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   const { fullname, email, password, vehicle } = req.body;

   const isCaptainAlreadyExist = await captainModel.findOne({ email });

   if (isCaptainAlreadyExist) {
      return res.status(400).json({ message: 'Captain already exist' });
   }


   const hashedPassword = await captainModel.hashPassword(password);


   const captain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType
   });

   const token = captain.generateAuthToken();

   console.log("Received Data:", JSON.stringify(req.body, null, 2));

   res.status(201).json({ token, captain });
}


module.exports.loginCaptain = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   const { email, password } = req.body;

   const captain = await captainModel.findOne({ email }).select('+password');

   if (!captain) {
      return res.status(401).json({ message: 'Invalid Email and password' })
   }

   const isMatch = await captain.comparePassword(password);

   if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Email and password' });
   }

   const token = captain.generateAuthToken();

   res.cookie('token', token)

   res.status(201).json({ token, captain });
}

module.exports.getAvailableCaptain = async (req, res, next) => {
  try {
    const captains = await captainModel.find({
      status: 'inactive'
    });

    res.status(200).json(captains);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch captains", error: err.message });
  }
};

module.exports.getCaptainDetail = async (req, res, next) => {
   try {
    const captain = await captainModel.findOne({ _id: req.params.capId });
    if (!captain) return res.status(404).json({ message: 'Captain not found' });
    res.status(200).json(captain);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports.getCaptainProfile = async (req, res, next) => {
    try {
    const captain = await captainModel.findById(req.captain._id).select("-password");
     console.log(captain);
    res.json({
      firstname: captain.fullname.firstname,
      lastname: captain.fullname.lastname,
      email: captain.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}

module.exports.logoutCaptain = async (req, res, next) => {
   res.clearCookie('token');
   const token = req.cookies.token || req.headers.authorization.split(' ')[1];

   await blacklistTokenModel.create({ token });

   res.status(200).json({ message: 'Logged out' });
}