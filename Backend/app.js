const express = require('express') 
const dotenv = require('dotenv')
dotenv.config();
const cors = require('cors')
const connectToDB = require('./Database/db')
const userRoutes = require('./Routes/user.route');
const captainRoutes = require('./Routes/captain.route');
const rideRoutes = require('./Routes/ride.route');
const cookiesParser = require('cookie-parser');
const app = express()

app.use(cors({
  // origin: 'http://localhost:5173',  // your frontend origin
  // credentials: true  
 }              // allow cookies to be sent
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

app.get('/',(req,res)=>{
 res.send("Hello");
})
module.exports = app;