const mongoose = require("mongoose")

function connectToDB(){
 mongoose.connect(process.env.DB_Connect).then(() => console.log("Database Created")).catch(err => console.log(err));
}

module.exports = connectToDB; 