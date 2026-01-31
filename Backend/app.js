const express = require('express') 
const dotenv = require('dotenv')
dotenv.config();
const cors = require('cors')
const connectToDB = require('./Database/db.js')
const userRoutes = require('./Routes/user.route.js');
const captainRoutes = require('./Routes/captain.route.js');
const rideRoutes = require('./Routes/ride.route.js');
const mapRoutes = require('./Routes/map.route.js');
const paymentRoutes = require('./Routes/payment.route.js');
const notificationRoutes = require('./Routes/notification.routes.js');
const cookiesParser = require('cookie-parser');
const app = express()

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST"],
  credentials: true,
 }             
))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookiesParser())
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store"); 
  next();
});

connectToDB();

app.use('/api/user', userRoutes);

app.use('/api/ride', rideRoutes);

app.use('/api/captain', captainRoutes)

app.use('/api/map', mapRoutes);

app.use('/api/notification', notificationRoutes);

app.use('/api/payment', paymentRoutes);

app.get('/',(req,res)=>{
 res.send("Hello");
})
module.exports = app;