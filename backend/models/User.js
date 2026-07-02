const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'], trim: true, maxlength: 60,
  },
  email: {
    type: String, required: [true, 'Email is required'],
    unique: true, lowercase: true, trim: true,
  },
  password: {
    type: String, required: [true, 'Password is required'], minlength: 6, select: false,
  },
  role: {
    type: String, enum: ['candidate', 'recruiter'], default: 'candidate',
  },
  avatar: { type: String, default: '' },

  // Candidate fields
  resume:    { type: String, default: '' },   // Cloudinary URL
  resumeName:{ type: String, default: '' },
  headline:  { type: String, default: '' },   // "Full Stack Developer"
  skills:    [{ type: String }],
  experience:{ type: String, default: '' },   // "2 years"
  location:  { type: String, default: '' },

  // Recruiter fields
  company:        { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  companyLogo:    { type: String, default: '' },

  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = mongoose.model('User', userSchema);
