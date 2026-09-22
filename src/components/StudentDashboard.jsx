import React from 'react';
import {
  BookOpen,
  FileCheck2,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import RealtimeClockWidget from './RealtimeClockWidget';
import RealtimeActivityFeed from './RealtimeActivityFeed';

export default function StudentDashboard({ currentUser, setActiveTab, exams, assignments, courses, announcements }) {
  const activeExams = exams.filter(e => e.status === 'active');
  const pendingAssignments = assignments.filter(a => {
    const subs = a.submissions || [];
    return !subs.some(s => s.studentId === currentUser.id);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Realtime Live Clock & Ticker Bar */}
      <RealtimeClockWidget />

      {/* Hero Banner */}
      <div className="hero-banner">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            🎓 Portal Siswa • SMKN 1 Cibinong
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Selamat Datang, {currentUser.name}!
          </h2>
          <p style={{ opacity: 0.9, maxWidth: '650px', fontSize: '0.95rem' }}>
            Kelas: <strong>{currentUser.classRoom}</strong> • Jurusan: <strong>{currentUser.major}</strong> • NISN: {currentUser.identityNo}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={() => setActiveTab('courses')} className="btn btn-accent">
              <BookOpen size={16} /> Lihat Modul & Mapel
            </button>
            <button onClick={() => setActiveTab('exams')} className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
              <FileCheck2 size={16} /> Ujian CBT Online
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rata-rata Nilai</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>92.5</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Award size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 600 }}>
            ↑ Sangat Baik (Predikat A)
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Kehadiran Bulan Ini</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>100%</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            18 Hari Hadir Tepat Waktu
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tugas Perlu Diunggah</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>{pendingAssignments.length}</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
              <Clock size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.5rem', fontWeight: 600 }}>
            Deadline terdekat minggu ini
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mata Pelajaran Active</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>{courses.length}</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <BookOpen size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Semester Ganjil 2025/2026
          </p>
        </div>
      </div>

      {/* Main Grid: CBT Exam Launcher & Homework & Announcements */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active CBT Exam Alert */}
          {activeExams.length > 0 && (
            <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(16,185,129,0.08) 100%)', border: '1px solid rgba(37,99,235,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileCheck2 size={26} />
                  </div>
                  <div>
                    <span className="badge badge-danger" style={{ marginBottom: '0.2rem' }}>UJIAN ONLINE CBT AKTIF</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {activeExams[0].title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Waktu Pengerjaan: {activeExams[0].durationMinutes} Menit • {activeExams[0].totalQuestions} Soal
                    </p>
                  </div>
                </div>
                <button onClick={() => setActiveTab('exams')} className="btn btn-primary">
                  Kerjakan Ujian CBT <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Pending Homework / Assignments */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} style={{ color: 'var(--primary)' }} /> Tugas & Pengumpulan Aktif
              </h3>
              <button onClick={() => setActiveTab('assignments')} className="btn btn-outline btn-sm">
                Lihat Semua ({assignments.length})
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {assignments.map(asg => {
                const mySub = (asg.submissions || []).find(s => s.studentId === currentUser.id);
                return (
                  <div key={asg.id} style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-main)'
                  }}>
                    <div>
                      <span className="badge badge-primary">{asg.courseTitle}</span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--text-main)' }}>
                        {asg.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Deadline: {asg.deadline}
                      </p>
                    </div>

                    <div>
                      {mySub ? (
                        <span className="badge badge-success">
                          ✓ Sudah Dikumpulkan (Skor: {mySub.score !== null ? mySub.score : 'Belum Dinilai'})
                        </span>
                      ) : (
                        <button onClick={() => setActiveTab('assignments')} className="btn btn-secondary btn-sm">
                          Kumpulkan Tugas
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Schedule & Announcements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Realtime Activity Feed Stream */}
          <RealtimeActivityFeed />

          {/* Announcements Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BellRing size={18} style={{ color: 'var(--accent-gold)' }} /> Pengumuman Sekolah
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {announcements.map(ann => (
                <div key={ann.id} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>{ann.category}</span>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--text-main)' }}>
                    {ann.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {ann.content.substring(0, 90)}...
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>
                    📅 {ann.date} • {ann.author}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
