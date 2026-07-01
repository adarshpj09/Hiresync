const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/jobs',         require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/users',        require('./routes/users'));

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true, service: 'HireSync API' }));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// ── DB + Start ────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 HireSync API running on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });
