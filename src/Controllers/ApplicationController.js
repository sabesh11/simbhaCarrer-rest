const express = require('express')
const router = express.Router()
const Application = require('../Modals/ApplicationModal')
const Jobs = require('../Modals/JobsModal')
// const nodemailer = require('nodemailer');
const nodemailer =require('nodemailer')



router.post('/addApplication', async (req, res) => {
    try {
        const { jobId, applicant, resume, email, image, } = req.body

        const jobs = Jobs.findById(jobId)

        if (!jobs) {
            res.status(404).send("job not found")
        }

        const application = new Application({
            job: jobId,
            applicant: applicant,
            resume: resume,
            email: email,
            image: image,
        })

        await application.save()
        res.status(201).send("Application Added Successfully")
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
})

router.get("/getAllApplicant", async (req, res) => {
    try {
        const applicant = await Application.find()
        res.status(200).send(applicant)
    } catch (e) {
        console.error(e)
        res.status(500).send("no applicant")
    }
})

router.get("/getApplicantbyStatus/:status", async (req, res) => {
    try {
        const { status } = req.params

        const applicant = await Application.find({ status: status }).populate('Jobs')
        if (!applicant) {
           return res.status(404).send('no applicant find by this status')
        }
        res.status(200).send(applicant)
    } catch (e) {
        console.error(e)
        res.status(500).send("error found")
    }
})

router.post("/setApplicantStatusSelected/:ApplicantId", async (req, res) => {
    try {
        const { ApplicantId } = req.params;
        const applicant = await Application.findById(ApplicantId);
        if (!applicant) {
           return res.status(0).send("appliant not found")
        }
        applicant.status = "Selected";
        applicant.selected = true
        applicant.save()

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: applicant.email, 
            subject: 'Congratulations! You have been selected',
            text: `Dear ${applicant.name},\n\nCongratulations! We are pleased to inform you that you have been selected for the position. We will contact you soon with further details.\n\nBest regards,\nYour Company Name`,
          };
      
          await transporter.sendMail(mailOptions);
        res.status(200).send("set status selected")

    } catch (e) {
        console.error(e)
        res.status(500).send("some error occur")
    }
})

router.post("/setApplicantStatusSelected/:ApplicantId", async (req, res) => {
    try {
        const { ApplicantId } = req.params;
        const applicant = await Application.findById(ApplicantId);
        if (!applicant) {
           return res.status(0).send("appliant not found")
        }
        applicant.status = "rejected";
        applicant.rejected = true
        applicant.save()
        res.status(200).send("set status rejected")

    } catch (e) {
        console.error(e)
        res.status(500).send("some error occur")
    }
})

let otpStore = {};


const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); 
};

router.post('/send-otp/:email', (req, res) => {
const { email } = req.params;
  console.log(email);
  
    
    
  
  
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, // or 587 for TLS
        secure: true,
        service: 'gmail', 
        auth: {
          user: 'sabeshedextech@gmail.com', 
          pass: 'rpon righ olvs metw', 
        },
        tls: {
            rejectUnauthorized: false
          }
      }); 
      

      const otp = generateOTP();

      otpStore[email] = otp; 


    const mailOptions = {
      from: 'sabeshedextech@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`
    };
  
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending OTP', error });
      }
      res.status(200).json({ message: 'OTP sent successfully', otp });
    });
  });


router.post('/verify-otp', (req, res) => {
    const { email,otp } = req.body;
  
    
    if (otpStore[email] && otpStore[email] == otp) {
      delete otpStore[email]; 
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  });

  module.exports = router;