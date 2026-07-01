const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.recruiterOnly = (req, res, next) => {
  if (req.user.role !== 'recruiter')
    return res.status(403).json({ error: 'Recruiters only' });
  next();
};

exports.candidateOnly = (req, res, next) => {
  if (req.user.role !== 'candidate')
    return res.status(403).json({ error: 'Candidates only' });
  next();
};
