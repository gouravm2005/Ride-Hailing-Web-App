const captainModel = require('../Models/captain.model.js')

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
  },
  rideFeePerKm: vehicleType === 'bike' ? 10 : vehicleType === 'auto' ? 15 : 20
 })
 return captain;
}