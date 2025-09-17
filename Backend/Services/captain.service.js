const captainModel = require('../Models/captain.model')

module.exports.createCaptain = async({
 firstname, lastname, email, password, name, color, plate, capacity, vehicleType
}) => {
 if(!firstname || !email || !password || !name || !color || !plate || !capacity || !vehicleType){
  throw new Error('All fields are required');
 }
 const captain = captainModel.create({
  fullname : {
   firstname,
   lastname
  },
  email,
  password,
  vehicle:{
  name,
  color,
  plate,
  capacity,
  vehicleType
  }
 })
 return captain;
}