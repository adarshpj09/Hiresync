const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, recruiterOnly } = require('../middleware/auth');

// GET /api/jobs — public, with filters + search
router.get('/', async (req, res) => {
  try {
    const { search, type, experience, location, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (type)       query.type = type;
    if (experience) query.experience = experience;
    if (location)   query.location = new RegExp(location, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('postedBy', 'name company companyLogo'),
      Job.countDocuments(query),
    ]);

    res.json({ jobs, total, pages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/:id — public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company companyLogo companyWebsite');
    if (!job || !job.isActive) return res.status(404).json({ error: 'Job not found' });
    job.views += 1;
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs — recruiter only
router.post('/', protect, recruiterOnly, async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      company: req.user.company || req.body.company,
      companyLogo: req.user.companyLogo || '',
      postedBy: req.user._id,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/jobs/:id — recruiter only (own jobs)
router.put('/:id', protect, recruiterOnly, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });
    if (!job) return res.status(404).json({ error: 'Job not found or not yours' });
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/jobs/:id — recruiter only (own jobs)
router.delete('/:id', protect, recruiterOnly, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
    if (!job) return res.status(404).json({ error: 'Job not found or not yours' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/recruiter/mine — recruiter's own jobs
router.get('/recruiter/mine', protect, recruiterOnly, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
