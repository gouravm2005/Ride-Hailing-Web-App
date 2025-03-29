const express = require("express") 
const dotenv = require('dotenv')
dotenv.config();
const cors = require('cors')
const connectToDB = require('./Database/db')
const userRoutes = require('./Routes/user.route');
const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))

connectToDB();

app.get('/',(req,res)=>{
 res.send("Hello");
})

app.use('/user', userRoutes);

module.exports = app;