const mongoose = require('mongoose');

 const db = mongoose.connect("mongodb://127.0.0.1:27017/AttendenceSystem").then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Not connect mongodb",err);
})

module.exports = db;