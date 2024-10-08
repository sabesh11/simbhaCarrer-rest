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


router.put("/updatejob/:jobId",async (req,res)=>{
    try{
        const { jobId } = req.params
        const jobs = await Jobs.findById(jobId)

        if(jobs!=null){
            jobs.jobTitle = req.body.jobTitle
            jobs.jobDescription = req.body.jobDescription
            jobs.jobLocation=req.body.jobLocation
            jobs.jobType=req.body.jobType
            jobs.Salary=req.body.Salary
            await jobs.save()
            res.status(200).send('job has been updated successfully')
        }
        else{
            res.status(500).send('job not found')
        }
    }
    catch(e){
        res.status(500).send("error in getting jobs")
    }
})

module.exports = router;