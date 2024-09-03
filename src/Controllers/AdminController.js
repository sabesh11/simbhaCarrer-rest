const express = require('express')
const router = express.Router()
const Admin = require('../Modals/AdminModal')


router.post('/addAdmin',async(req,res)=>{
    try{
        const{username,password}=req.body
        const admin = new Admin({
            username:username,
            password:password})

        await admin.save()
    }catch(e){
        console.log(e)
        res.status(500).send('error found')
    }
})
router.post('/checkAdminLogin',async(req,res)=>{
    try{
        const {username,password} = req.body

        const admin = Admin.findOne({username})

        if(!admin){
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (password !== admin.password) {

            return res.status(401).json({ message: 'Invalid username or password' });
          }

          return res.status(200).json({ message: 'Login successful', adminId: admin._id });
         
    }
    catch(e){
        console.log(e)
        res.status(500).send('error found')
    }
})