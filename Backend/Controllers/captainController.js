const captainModel = require('../models/captain.model.js')
const captainService = require('../services/captain.service.js')
const { validationResult } = require('express-validator')
const blacklistTokenModel = require('../models/blacklistToken.model.js')


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
      name: vehicle.name,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
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

   // mark captain online when they login
   try {
     captain.status = 'active';
     await captain.save();
   } catch (e) {
     console.error('Failed to set captain status active on login', e);
   }

   res.cookie('token', token)

   res.status(201).json({ token, captain });
}

module.exports.getAvailableCaptain = async (req, res, next) => {
  try {
    // Return only active captains who are currently online
    const captains = await captainModel.find({ status: 'active' });

    res.status(200).json(captains);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch captains", error: err.message });
  }
};

module.exports.getCaptainDetail = async (req, res, next) => {
   try {
    const captain = await captainModel.findOne({ _id: req.params.captainId });
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
   try {
     // mark captain inactive on logout
     if (req.captain && req.captain._id) {
       await captainModel.findByIdAndUpdate(req.captain._id, { status: 'inactive' });
     }
   } catch (e) {
     console.error('Failed to set captain inactive on logout', e);
   }

   res.clearCookie('token');
   const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

   if (token) {
     await blacklistTokenModel.create({ token });
   }

   res.status(200).json({ message: 'Logged out' });
}


module.exports.getCaptainETA = async (req, res) => {
  const { pickuplnglat, destinationlnglat } = req.body;

  if (
    !pickuplnglat ||
    !destinationlnglat ||
    typeof pickuplnglat.lat !== "number" ||
    typeof pickuplnglat.lng !== "number" ||
    typeof destinationlnglat.lat !== "number" ||
    typeof destinationlnglat.lng !== "number"
  ) {
    console.error("Invalid coordinates:", pickuplnglat, destinationlnglat);
    return res.status(400).json({ distance: 0, duration: 0 });
  }

  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${pickuplnglat.lng},${pickuplnglat.lat};${destinationlnglat.lng},${destinationlnglat.lat}?overview=false`;

    const osrmRes = await axios.get(url);

    if (osrmRes.data.routes?.length) {
      const route = osrmRes.data.routes[0];

      return res.json({
        distance: Number((route.distance / 1000).toFixed(2)), // km
        duration: Math.round(route.duration / 60) // minutes
      });
    }

    return res.json({ distance: 0, duration: 0 });
  } catch (err) {
    console.error("OSRM error:", err.message);
    return res.status(500).json({ distance: 0, duration: 0 });
  }
};

module.exports.updateCaptainStatus = async (req, res, next) => {
  try {
    const { captainId, status } = req.body;
    const captain = await captainModel.findByIdAndUpdate(captainId, { status }, { new: true });
    if (!captain) {
      return res.status(404).json({ message: 'Captain not found' });
    }
    res.status(200).json({ message: 'Status updated', captain });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
}