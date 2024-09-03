const express = require("express")
const app = express()
const port = 5000
const mongoose = require('mongoose')
const cors =require("cors")

app.listen(port,()=>{console.log("server is running"+port);})

const MONGODB_URL ="mongodb://127.0.0.1:27017/simbha-careers"

mongoose.connect(MONGODB_URL)
.then(()=>{
    console.log("Connection successful"  + MONGODB_URL);
})
.catch((err)=>{
console.error("error in connecting",err.message);
})

app.use(express.json());


app.use(cors(
    {
        origin:"*"
    }
))






