import {
  INITIAL_SCHOOL_INFO,
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_MODULES,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
  INITIAL_ATTENDANCE,
  INITIAL_ANNOUNCEMENTS
} from './mockData.js';

const STORAGE_KEYS = {
  USERS: 'smkn1_lms_users',
  COURSES: 'smkn1_lms_courses',
  MODULES: 'smkn1_lms_modules',
  ASSIGNMENTS: 'smkn1_lms_assignments',
  EXAMS: 'smkn1_lms_exams',
  ATTENDANCE: 'smkn1_lms_attendance',
  ANNOUNCEMENTS: 'smkn1_lms_announcements',
  CURRENT_USER: 'smkn1_lms_current_user',
  EXAM_RESULTS: 'smkn1_lms_exam_results'
};

// Helper Read/Write LocalStorage
function getStoredData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Service API
export const apiService = {
  // Init database
  initDatabase: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) setStoredData(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) setStoredData(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    if (!localStorage.getItem(STORAGE_KEYS.MODULES)) setStoredData(STORAGE_KEYS.MODULES, INITIAL_MODULES);
    if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) setStoredData(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) setStoredData(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) setStoredData(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) setStoredData(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    if (!localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS)) setStoredData(STORAGE_KEYS.EXAM_RESULTS, []);
  },

  // Auth / Current User Management
  getCurrentUser: () => {
    const defaultUser = INITIAL_USERS[0]; // Default: Ahmad Rizki (Siswa)
    return getStoredData(STORAGE_KEYS.CURRENT_USER, defaultUser);
  },

  setCurrentUser: (user) => {
    setStoredData(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  },

  getUsers: () => getStoredData(STORAGE_KEYS.USERS, INITIAL_USERS),

  addUser: (newUser) => {
    const users = getStoredData(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = [newUser, ...users];
    setStoredData(STORAGE_KEYS.USERS, updated);
    return updated;
  },

  deleteUser: (userId) => {
    const users = getStoredData(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = users.filter(u => u.id !== userId);
    setStoredData(STORAGE_KEYS.USERS, updated);
    return updated;
  },

  // Courses / Mapel
  getCourses: () => getStoredData(STORAGE_KEYS.COURSES, INITIAL_COURSES),

  addCourse: (newCourse) => {
    const courses = getStoredData(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const updated = [newCourse, ...courses];
    setStoredData(STORAGE_KEYS.COURSES, updated);
    return updated;
  },

  // Modules
  getModules: (courseId) => {
    const modules = getStoredData(STORAGE_KEYS.MODULES, INITIAL_MODULES);
    if (!courseId) return modules;
    return modules.filter(m => m.courseId === courseId);
  },

  addModule: (newMod) => {
    const modules = getStoredData(STORAGE_KEYS.MODULES, INITIAL_MODULES);
    const updated = [newMod, ...modules];
    setStoredData(STORAGE_KEYS.MODULES, updated);
    return updated;
  },

  // Assignments
  getAssignments: () => getStoredData(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS),

  submitAssignment: (asgId, studentId, studentName, fileUrl, notes) => {
    const assignments = getStoredData(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    const updated = assignments.map(asg => {
      if (asg.id === asgId) {
        const existingSubmissions = asg.submissions || [];
        const filtered = existingSubmissions.filter(s => s.studentId !== studentId);
        const newSub = {
          studentId,
          studentName,
          submittedAt: new Date().toLocaleString('id-ID'),
          fileUrl: fileUrl || 'jawaban_tugas.pdf',
          notes,
          score: null,
          feedback: null
        };
        return { ...asg, submissions: [newSub, ...filtered] };
      }
      return asg;
    });
    setStoredData(STORAGE_KEYS.ASSIGNMENTS, updated);
    return updated;
  },

  gradeSubmission: (asgId, studentId, score, feedback) => {
    const assignments = getStoredData(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    const updated = assignments.map(asg => {
      if (asg.id === asgId) {
        const subs = (asg.submissions || []).map(s => {
          if (s.studentId === studentId) {
            return { ...s, score: Number(score), feedback };
          }
          return s;
        });
        return { ...asg, submissions: subs };
      }
      return asg;
    });
    setStoredData(STORAGE_KEYS.ASSIGNMENTS, updated);
    return updated;
  },

  // CBT Ujian
  getExams: () => getStoredData(STORAGE_KEYS.EXAMS, INITIAL_EXAMS),

  addExam: (newExam) => {
    const exams = getStoredData(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    const updated = [newExam, ...exams];
    setStoredData(STORAGE_KEYS.EXAMS, updated);
    return updated;
  },

  updateExam: (updatedExam) => {
    const exams = getStoredData(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    const updated = exams.map(e => e.id === updatedExam.id ? updatedExam : e);
    setStoredData(STORAGE_KEYS.EXAMS, updated);
    return updated;
  },

  deleteExam: (examId) => {
    const exams = getStoredData(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    const updated = exams.filter(e => e.id !== examId);
    setStoredData(STORAGE_KEYS.EXAMS, updated);
    return updated;
  },

  getExamResults: () => getStoredData(STORAGE_KEYS.EXAM_RESULTS, []),

  saveExamResult: (resultData) => {
    const results = getStoredData(STORAGE_KEYS.EXAM_RESULTS, []);
    const updated = [resultData, ...results];
    setStoredData(STORAGE_KEYS.EXAM_RESULTS, updated);
    return updated;
  },

  // Attendance Presensi
  getAttendance: () => getStoredData(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),

  recordAttendance: (record) => {
    const attendance = getStoredData(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    // Replace if already attended today
    const filtered = attendance.filter(a => !(a.studentId === record.studentId && a.date === record.date));
    const updated = [record, ...filtered];
    setStoredData(STORAGE_KEYS.ATTENDANCE, updated);
    return updated;
  },

  // Announcements
  getAnnouncements: () => getStoredData(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),

  addAnnouncement: (ann) => {
    const list = getStoredData(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const updated = [ann, ...list];
    setStoredData(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    return updated;
  },

  resetToDefault: () => {
    localStorage.clear();
    apiService.initDatabase();
    window.location.reload();
  }
};
