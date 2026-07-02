const express = require('express');
const router = express.Router();
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const fields = ['name', 'headline', 'skills', 'experience', 'location', 'company', 'companyWebsite'];
    fields.forEach(f => { if (req.body[f] !== undefined) req.user[f] = req.body[f]; });
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/resume — upload resume PDF
router.post('/resume', protect, async (req, res) => {
  try {
    if (!req.files?.resume) return res.status(400).json({ error: 'No file uploaded' });
    const file = req.files.resume;
    if (!file.name.endsWith('.pdf')) return res.status(400).json({ error: 'Only PDF files allowed' });

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'raw', folder: 'hiresync/resumes',
      public_id: `resume_${req.user._id}`,
    });

    req.user.resume     = result.secure_url;
    req.user.resumeName = file.name;
    await req.user.save();
    res.json({ resume: result.secure_url, resumeName: file.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/save-job/:jobId
router.post('/save-job/:jobId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.savedJobs.indexOf(req.params.jobId);
    if (idx > -1) user.savedJobs.splice(idx, 1);   // unsave
    else user.savedJobs.push(req.params.jobId);      // save
    await user.save();
    res.json({ savedJobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
