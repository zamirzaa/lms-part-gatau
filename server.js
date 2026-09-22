import express from 'express';
import cors from 'cors';
import {
  INITIAL_SCHOOL_INFO,
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
  INITIAL_ANNOUNCEMENTS
} from './src/services/mockData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Info Endpoint
app.get('/api/info', (req, res) => {
  res.json({
    status: "success",
    school: INITIAL_SCHOOL_INFO,
    message: "REST API Server e-Learning SMKN 1 Cibinong Running"
  });
});

// Users REST Endpoint
app.get('/api/users', (req, res) => {
  res.json(INITIAL_USERS);
});

// Courses REST Endpoint
app.get('/api/courses', (req, res) => {
  res.json(INITIAL_COURSES);
});

// Exams CBT Endpoint
app.get('/api/exams', (req, res) => {
  res.json(INITIAL_EXAMS);
});

// Announcements Endpoint
app.get('/api/announcements', (req, res) => {
  res.json(INITIAL_ANNOUNCEMENTS);
});

// Fallback serve static build if needed
app.use(express.static('dist'));

app.listen(PORT, () => {
  console.log(`Server API LMS SMKN 1 Cibinong berjalan di http://localhost:${PORT}`);
});
