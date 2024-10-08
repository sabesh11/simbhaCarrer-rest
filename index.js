const express = require("express")
const app = express()
const port = 5000
const mongoose = require('mongoose')
const cors =require("cors")
const nodemailer = require('nodemailer');

app.listen(port,()=>{console.log("server is running"+port);})

const MONGODB_URL ="mongodb://127.0.0.1:27017/simbha-careers"

mongoose.connect(MONGODB_URL)
.then(()=>{
    console.log("Connection successful"  + MONGODB_URL);
})
.catch((err)=>{
console.error("error in connecting",err.message);
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

app.use(express.json());


app.use(cors(
    {
        origin:"*"
    }
))

const AdminRouter = require('./src/Controllers/AdminController')
const JobRouter = require('./src/Controllers/JobsController')
const ApplicationRouter = require('./src/Controllers/ApplicationController')
app.use("/Admin",AdminRouter)
app.use("/job",JobRouter)
app.use("/application",ApplicationRouter)




