const mongoose = require('mongoose')

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
  applicant: { type: String, required: true },
  resume: { type: String, required: true },
  email: { type: String },
  image: { type: String },
  mobilenumber:{type:String,require:true},
  status: { type: String, enum: ['shortlisted', 'selected', 'attended', 'rejected','not-attended','not-responding','pending'], default: 'pending' },
  selected:{type:Boolean,default:false},
  rejected:{type:Boolean,default:false},
  appliedAt: { type: Date, default: Date.now }
},{timestamps:true})

module.exports = mongoose.model('Application',ApplicationSchema)