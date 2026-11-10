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
  // Init database with smart auto-merge of new initial data (e.g. XII SIJA)
  initDatabase: () => {
    let existingUsers = getStoredData(STORAGE_KEYS.USERS, null);
    if (!existingUsers) {
      setStoredData(STORAGE_KEYS.USERS, INITIAL_USERS);
    } else {
      const existingIds = new Set(existingUsers.map(u => u.id));
      const missingUsers = INITIAL_USERS.filter(u => !existingIds.has(u.id));
      if (missingUsers.length > 0) {
        existingUsers = [...existingUsers, ...missingUsers];
        setStoredData(STORAGE_KEYS.USERS, existingUsers);
      }
    }

    let existingCourses = getStoredData(STORAGE_KEYS.COURSES, null);
    if (!existingCourses) {
      setStoredData(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    } else {
      const existingCourseIds = new Set(existingCourses.map(c => c.id));
      const missingCourses = INITIAL_COURSES.filter(c => !existingCourseIds.has(c.id));
      if (missingCourses.length > 0) {
        setStoredData(STORAGE_KEYS.COURSES, [...existingCourses, ...missingCourses]);
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.MODULES)) setStoredData(STORAGE_KEYS.MODULES, INITIAL_MODULES);
    if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) setStoredData(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) setStoredData(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) setStoredData(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) setStoredData(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    if (!localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS)) setStoredData(STORAGE_KEYS.EXAM_RESULTS, []);
  },

  // Auth / Current User Management
  getAuthenticatedUser: () => {
    return getStoredData(STORAGE_KEYS.CURRENT_USER, null);
  },

  getCurrentUser: () => {
    return getStoredData(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser: (user) => {
    if (user) {
      setStoredData(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    return user;
  },

  login: (identityOrUsername, password) => {
    const users = apiService.getUsers();
    const query = (identityOrUsername || '').trim().toLowerCase();

    // Find by NISN / NIP or username or full name
    const foundUser = users.find(u =>
      (u.identityNo && u.identityNo.toLowerCase() === query) ||
      (u.username && u.username.toLowerCase() === query) ||
      (u.name && u.name.toLowerCase() === query)
    );

    if (!foundUser) {
      return { success: false, message: 'NISN / NIP atau Username tidak terdaftar di sistem e-Learning SMKN 1 Cibinong.' };
    }

    // Default password for all accounts is '12345678'
    const correctPassword = foundUser.password || '12345678';
    if (password !== correctPassword && password !== '12345678') {
      return { success: false, message: 'Password salah! (Password default adalah: 12345678)' };
    }

    setStoredData(STORAGE_KEYS.CURRENT_USER, foundUser);
    return { success: true, user: foundUser };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
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

  updateUser: (updatedUser) => {
    const users = getStoredData(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
    setStoredData(STORAGE_KEYS.USERS, updated);
    const current = getStoredData(STORAGE_KEYS.CURRENT_USER, null);
    if (current && current.id === updatedUser.id) {
      const updatedCurrent = { ...current, ...updatedUser };
      setStoredData(STORAGE_KEYS.CURRENT_USER, updatedCurrent);
    }
    return updated;
  },

  updateCurrentUserProfile: (profileData) => {
    const current = apiService.getCurrentUser();
    if (!current) return { updatedUser: null, allUsers: apiService.getUsers() };

    // Proteksi: Nama dan NISN/NIP tidak boleh diubah oleh user profil biasa
    const sanitized = {
      ...current,
      email: profileData.email ?? current.email,
      phone: profileData.phone ?? current.phone,
      avatar: profileData.avatar ?? current.avatar,
      bio: profileData.bio ?? current.bio,
      address: profileData.address ?? current.address
      // name dan identityNo tetap dipertahankan dari current
    };
    setStoredData(STORAGE_KEYS.CURRENT_USER, sanitized);
    const users = getStoredData(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = users.map(u => u.id === sanitized.id ? sanitized : u);
    setStoredData(STORAGE_KEYS.USERS, updated);
    return { updatedUser: sanitized, allUsers: updated };
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
