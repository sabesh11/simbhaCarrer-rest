const express = require('express')
const router = express.Router()
const Application = require('../Modals/ApplicationModal')
const Jobs = require('../Modals/JobsModal')
// const nodemailer = require('nodemailer');
const nodemailer =require('nodemailer')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose')

const resumeUploadPath = path.join('C:', 'simbha-carrers', 'uploads','resume');
const imageUploadPath = path.join('C:', 'simbha-carrers', 'uploads');

if (!fs.existsSync(resumeUploadPath)) {
  fs.mkdirSync(resumeUploadPath, { recursive: true });
}
if (!fs.existsSync(imageUploadPath)) {
  fs.mkdirSync(imageUploadPath, { recursive: true });
}

const upload = multer({ dest: 'temp/' });


router.post('/addApplication', async (req, res) => {
    try {
        const { job, applicant, resume, email, image,mobilenumber } = req.body

        const jobs = Jobs.findById(job._id)

        if (!jobs) {
            res.status(404).send("job not found")
        }

        const application = new Application({
            job: job,
            applicant: applicant,
            resume: resume,
            email: email,
            image: image,
            mobilenumber:mobilenumber,
        })

        await application.save()
        res.status(201).send(application)
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
        const applicant = await Application.find() .populate('job'); 
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

  router.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const uniqueFileName = `${uuidv4()}_${file.originalname}`;
    const destinationPath = path.join(resumeUploadPath, uniqueFileName);
  
    // Move file from temp folder to the desired location
    fs.rename(file.path, destinationPath, (err) => {
      if (err) {
        return res.status(500).send('Failed to upload file.');
      }
  
      console.log('File saved at:', destinationPath);
      res.status(200).send(uniqueFileName);
    });
  });
  
  // Upload image file
  router.post('/image/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No image uploaded.');
    }
  
    const uniqueFileName = `${uuidv4()}_${file.originalname}`;
    const destinationPath = path.join(imageUploadPath, uniqueFileName);
  
    // Move image from temp folder to the desired location
    fs.rename(file.path, destinationPath, (err) => {
      if (err) {
        return res.status(500).send('Failed to upload image.');
      }
  
      console.log('Image saved at:', destinationPath);
      res.status(200).send(uniqueFileName);
    });
  });

  router.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
   // Specify your image directory

    // Construct the full path to the image
    const filePath = path.join(imageUploadPath, filename);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        // Send the image file
        res.sendFile(filePath, { 
            headers: {
                'Content-Type': 'image/jpeg' // Adjust the content type as needed
            }
        });
    });
});

router.get('/resume/:filename', (req, res) => {
  const filename = req.params.filename;
 // Specify your image directory

  // Construct the full path to the image
  const filePath = path.join(resumeUploadPath, filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
          return res.status(404).send('File not found');
      }

      
      res.sendFile(filePath, { 
          headers: {
              'Content-Type': 'application/pdf' // Adjust the content type as needed
          }
      });
  });
});

  module.exports = router;