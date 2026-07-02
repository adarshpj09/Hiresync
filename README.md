# HireSync — Full-Stack MERN Job Portal

A modern job portal connecting candidates and recruiters in real time. Built with MongoDB, Express, React, and Node.js.

## Features

- **Two roles**: Candidates browse and apply to jobs; Recruiters post jobs and manage applicants
- **JWT authentication** with bcrypt password hashing
- **Resume upload** via Cloudinary (PDF storage)
- **Job search & filters**: text search, type, experience level, location
- **Application tracking**: pending → reviewing → shortlisted → hired/rejected pipeline
- **Saved jobs** (bookmarking)
- **Recruiter dashboard**: post jobs, view applicants, update application status
- **Fully responsive** UI with a custom design system

## Tech Stack

**Backend:** Node.js · Express · MongoDB (Mongoose) · JWT · bcryptjs · Cloudinary
**Frontend:** React 18 · React Router · Axios · Vite

## Project Structure

```
hiresync/
├── backend/
│   ├── server.js              ← Entry point
│   ├── config/cloudinary.js   ← File upload config
│   ├── models/                ← User, Job, Application schemas
│   ├── routes/                ← auth, jobs, applications, users
│   ├── middleware/auth.js     ← JWT protect + role guards
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/             ← Home, Jobs, JobDetail, Login, Register, Profile
│   │   ├── pages/dashboard/   ← Candidate & Recruiter dashboard views
│   │   ├── components/        ← Navbar, JobCard, Toast
│   │   ├── context/           ← AuthContext
│   │   └── utils/api.js       ← Axios instance
│   └── .env.example
└── render.yaml
```

## Local Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your MongoDB URI, JWT secret, Cloudinary keys
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000/api
npm run dev
```

Visit `http://localhost:5173`.

## Deployment

(MongoDB Atlas, Cloudinary, Render).

## License

MIT — free to use for learning, portfolios, and resumes.
