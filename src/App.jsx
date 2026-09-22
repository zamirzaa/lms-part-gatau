import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import CourseList from './components/CourseList';
import CbtExamModule from './components/CbtExamModule';
import AttendanceModule from './components/AttendanceModule';
import GradesReportModule from './components/GradesReportModule';
import { apiService } from './services/apiService';

export default function App() {
  // Init database on first load
  useEffect(() => {
    apiService.initDatabase();
  }, []);

  const [currentUser, setCurrentUser] = useState(() => apiService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  // App Data States
  const [courses, setCourses] = useState(() => apiService.getCourses());
  const [modules, setModules] = useState(() => apiService.getModules());
  const [assignments, setAssignments] = useState(() => apiService.getAssignments());
  const [exams, setExams] = useState(() => apiService.getExams());
  const [attendance, setAttendance] = useState(() => apiService.getAttendance());
  const [announcements, setAnnouncements] = useState(() => apiService.getAnnouncements());
  const [users, setUsers] = useState(() => apiService.getUsers());

  // Handle User Change (Role Switcher)
  const handleUserChange = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  // Render View Based on Active Tab & User Role
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'siswa') {
          return (
            <StudentDashboard
              currentUser={currentUser}
              setActiveTab={setActiveTab}
              exams={exams}
              assignments={assignments}
              courses={courses}
              announcements={announcements}
            />
          );
        } else if (currentUser.role === 'guru') {
          return (
            <TeacherDashboard
              currentUser={currentUser}
              courses={courses}
              assignments={assignments}
              exams={exams}
              setAssignments={setAssignments}
            />
          );
        } else {
          return (
            <AdminDashboard
              currentUser={currentUser}
              users={users}
              setUsers={setUsers}
              announcements={announcements}
              setAnnouncements={setAnnouncements}
            />
          );
        }
      case 'courses':
        return (
          <CourseList
            currentUser={currentUser}
            courses={courses}
            setCourses={setCourses}
            modules={modules}
            setModules={setModules}
            assignments={assignments}
          />
        );
      case 'exams':
        return (
          <CbtExamModule
            currentUser={currentUser}
            exams={exams}
            setExams={setExams}
          />
        );
      case 'assignments':
        return (
          <StudentDashboard
            currentUser={currentUser}
            setActiveTab={setActiveTab}
            exams={exams}
            assignments={assignments}
            courses={courses}
            announcements={announcements}
          />
        );
      case 'attendance':
        return (
          <AttendanceModule
            currentUser={currentUser}
            attendance={attendance}
            setAttendance={setAttendance}
          />
        );
      case 'grades':
        return (
          <GradesReportModule
            currentUser={currentUser}
          />
        );
      case 'users':
        return (
          <AdminDashboard
            currentUser={currentUser}
            users={users}
            setUsers={setUsers}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
          />
        );
      case 'announcements':
        return (
          <div className="card">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
              📢 Pengumuman Resmi SMKN 1 Cibinong
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {announcements.map(ann => (
                <div key={ann.id} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)' }}>
                  <span className="badge badge-warning">{ann.category}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.35rem', color: 'var(--text-main)' }}>{ann.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.5 }}>{ann.content}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                    Dipublikasikan pada: {ann.date} oleh {ann.author}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Halaman tidak ditemukan.</div>;
    }
  };

  return (
    <div className={darkMode ? 'dark-theme' : ''} style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Top Navbar Header */}
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Body Layout */}
      <div style={{ display: 'flex' }}>
        <Sidebar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main style={{ flex: 1, padding: '1.75rem 2rem', overflowX: 'hidden' }}>
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
