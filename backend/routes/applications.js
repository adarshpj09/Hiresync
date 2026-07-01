const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const cloudinary = require('../config/cloudinary');
const { protect, candidateOnly, recruiterOnly } = require('../middleware/auth');

// POST /api/applications — candidate applies to a job
router.post('/', protect, candidateOnly, async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) return res.status(404).json({ error: 'Job not found' });

    const already = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (already) return res.status(400).json({ error: 'Already applied to this job' });

    let resumeUrl = req.user.resume;
    let resumeName = req.user.resumeName;

    // If new resume uploaded
    if (req.files?.resume) {
      const file = req.files.resume;
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'raw', folder: 'hiresync/resumes',
        public_id: `${req.user._id}_${Date.now()}`,
      });
      resumeUrl  = result.secure_url;
      resumeName = file.name;
    }

    if (!resumeUrl) return res.status(400).json({ error: 'Upload a resume to apply' });

    const application = await Application.create({
      job: jobId, applicant: req.user._id,
      resume: resumeUrl, resumeName,
      coverLetter: coverLetter || '',
    });

    // Increment applicant count
    job.applicants += 1;
    await job.save();

    await application.populate('job', 'title company location type');
    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Already applied to this job' });
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/mine — candidate's applications
router.get('/mine', protect, candidateOnly, async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salary companyLogo isActive')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/job/:jobId — recruiter sees applicants for a job
router.get('/job/:jobId', protect, recruiterOnly, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
    if (!job) return res.status(403).json({ error: 'Not your job' });

    const apps = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email headline skills location experience avatar')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/applications/:id/status — recruiter updates status
router.patch('/:id/status', protect, recruiterOnly, async (req, res) => {
  try {
    const { status, recruiterNote } = req.body;
    const app = await Application.findById(req.params.id).populate('job');
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // Verify job belongs to recruiter
    if (app.job.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not your job' });

    app.status = status;
    if (recruiterNote !== undefined) app.recruiterNote = recruiterNote;
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
