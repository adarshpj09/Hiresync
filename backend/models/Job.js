const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  company:     { type: String, required: true, trim: true },
  companyLogo: { type: String, default: '' },
  location:    { type: String, required: true },
  type:        { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], default: 'Full-time' },
  experience:  { type: String, enum: ['Fresher', '1-2 years', '2-5 years', '5+ years'], default: 'Fresher' },
  salary: {
    min:      { type: Number, default: 0 },
    max:      { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    period:   { type: String, default: 'year' },
  },
  description: { type: String, required: true },
  requirements:{ type: String, default: '' },
  skills:      [{ type: String }],
  benefits:    [{ type: String }],
  deadline:    { type: Date },
  openings:    { type: Number, default: 1 },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive:    { type: Boolean, default: true },
  views:       { type: Number, default: 0 },
  applicants:  { type: Number, default: 0 },
}, { timestamps: true });

// Text index for search
jobSchema.index({ title: 'text', company: 'text', skills: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
