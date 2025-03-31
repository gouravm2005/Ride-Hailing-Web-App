const express = require("express") 
const dotenv = require('dotenv')
dotenv.config();
const cors = require('cors')
const connectToDB = require('./Database/db')
const userRoutes = require('./Routes/user.route');
const captainRoutes = require('./Routes/captain.route');
const cookiesParser = require('cookie-parser');
const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookiesParser())

connectToDB();

app.get('/',(req,res)=>{
 res.send("Hello");
})

app.use('/user', userRoutes);

app.use('/captain', captainRoutes)

module.exports = app;