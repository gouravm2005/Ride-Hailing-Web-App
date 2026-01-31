const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const captainschema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "The name should be atleast 3 characters"]
    },
    lastname: {
      type: String,
      minlength: [3, "The name should be atleast 3 characters"]
    }
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    select: false
  },
  socketId: {
    type: String
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },

  vehicle: {
    name: {
      type: String,
      required: true,
      minlength: [2, 'the name must be at least 2 charaters long '],
    },
    color: {
      type: String,
      required: true,
      minlength: [3, 'color must be at least 3 characters long']
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, 'plate must be at least 3 characters long']
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'capacity must be at least 1'],
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['car', 'motorcycle', 'auto'],
    },
  },
location: {
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], default: [0, 0] } // placeholder
},
pickup: { type: String, default: "" },
pickupCoordinates: {
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], default: [0, 0] }
},
destination: { type: String, default: "" },
destinationCoordinates: {
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], default: [0, 0] }
},

  rideFeePerKm: {
    type: Number,
    enum: [10, 15, 20],
    default: 10
  },

  rideStats: {
    totalRides: {
      type: Number,
      default: 566
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5
    }
  },

  contact: {
    phone: String,
    whatsapp: String
  },

  dailyStats: {
    date: {
      type: Date,
      default: Date.now
    },
    distanceCovered: {
      type: Number,
      default: 0 // in kilometers
    },
    ridesAccepted: {
      type: Number,
      default: 0
    },
    ridesRejected: {
      type: Number,
      default: 0
    }
  }
})

captainschema.index({ location: '2dsphere' });

captainschema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
  return token;
}

captainschema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

captainschema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('Captain', captainschema)

module.exports = captainModel;