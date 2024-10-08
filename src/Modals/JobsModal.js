const mongoose = require("mongoose")

const jobsSchema = new mongoose.Schema({
    jobTitle:{type:String,require:true},
    jobDescription:{type:String,require:true},
    jobLocation:{type:String,require:true},
    jobType:{type:String,require:true},
    Salary:{type:String,require:true}
}, { timestamps: true })

module.exports = mongoose.model('Jobs',jobsSchema)