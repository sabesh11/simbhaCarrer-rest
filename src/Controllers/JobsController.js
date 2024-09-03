const express = require("express")
const router = express.Router()
const Jobs = require('../Modals/JobsModal')

router.post('/addjobs', async(req,res)=>{
    try{
        const jobs = new Jobs({
            jobTitle:req.body.jobTitle,
            jobDescription:req.body.jobDescription,
            jobLocation:req.body.jobLocation,
            jobType:req.body.jobType,
            jobExpiriyDate:req.body.jobExpiriyDate,
            Salary:req.body.Salary,
        });
        await jobs.save();
        res.status(200).send("jobs successfully added")
    }
    catch(e){
        res.status(500).send("error in adding jobs")
    }
})

router.get("/getJobs", async(req,res)=>{
    try{
        const jobs = await Jobs.find()
        res.status(200).send(jobs)
    }
    catch(e){
        res.status(500).send("error in getting jobs")
    }
})