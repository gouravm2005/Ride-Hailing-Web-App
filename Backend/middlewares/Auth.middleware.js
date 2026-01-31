const userModel = require('../Models/user.model.js')
const captainModel = require('../Models/captain.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blacklistTokenModel = require('../Models/blacklistToken.model.js')

module.exports.AuthUser = async (req, res, next) => {
 const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
 if (!token) {
  return res.status(401).json({ message: 'Unauthorized' })
 }

 const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

 if (isBlacklisted) {
  return res.status(401).json({ message: 'Unauthorized' })
 }

 try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded || !decoded._id) {
   return res.status(401).json({ message: "Invalid token payload" });
  }

  const user = await userModel.findById(decoded._id);
  if (!user) return res.status(401).json({ message: "User not found" });

  req.user = user;

  return next();

 } catch (error) {
  return res.status(401).json({ message: 'Unauthorized' })
 }
}

module.exports.AuthCaptain = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized: Token blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const captain = await captainModel.findById(decoded._id);

    if (!captain) {
      return res.status(401).json({ message: "Captain not found" });
    }

    req.captain = captain; 
    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
