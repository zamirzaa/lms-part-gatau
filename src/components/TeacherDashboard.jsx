import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  FileCheck2,
  PlusCircle,
  CheckCircle,
  Clock,
  Edit3,
  Award
} from 'lucide-react';
import { apiService } from '../services/apiService';
import RealtimeClockWidget from './RealtimeClockWidget';
import RealtimeActivityFeed from './RealtimeActivityFeed';

export default function TeacherDashboard({ currentUser, courses, assignments, exams, setAssignments }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [scoreInput, setScoreInput] = useState(90);
  const [feedbackInput, setFeedbackInput] = useState('Pekerjaan sangat rapi dan memenuhi kriteria.');

  // Find all un-graded or submitted assignments
  const pendingGrades = [];
  assignments.forEach(asg => {
    (asg.submissions || []).forEach(sub => {
      pendingGrades.push({
        assignmentId: asg.id,
        assignmentTitle: asg.title,
        ...sub
      });
    });
  });

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    const updatedAsgs = apiService.gradeSubmission(
      selectedSubmission.assignmentId,
      selectedSubmission.studentId,
      scoreInput,
      feedbackInput
    );
    setAssignments(updatedAsgs);
    setSelectedSubmission(null);
    alert(`Nilai ${scoreInput} berhasil dikirim untuk ${selectedSubmission.studentName}!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Realtime Live Clock Widget */}
      <RealtimeClockWidget />

      {/* Teacher Hero Banner */}
      <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            👨‍🏫 Portal Pengajar • SMKN 1 Cibinong
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Selamat Datang, {currentUser.name}
          </h2>
          <p style={{ opacity: 0.9, maxWidth: '650px', fontSize: '0.95rem' }}>
            Pengampu: <strong>{currentUser.subject}</strong> • Jurusan: <strong>{currentUser.major}</strong> • NIP: {currentUser.identityNo}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Siswa Diajar</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>144</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Users size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Kelas XII RPL 1 & XII RPL 2
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Mapel Pengampuan</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>{courses.length}</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
              <BookOpen size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Kurikulum Merdeka SMK
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tugas Dikumpulkan</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>{pendingGrades.length}</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
              <Clock size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.5rem', fontWeight: 600 }}>
            Perlu Penilaian & Feedback
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ujian CBT Aktif</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>{exams.length}</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <FileCheck2 size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Bank Soal & Auto Grade
          </p>
        </div>
      </div>

      {/* Grading Submissions & Realtime Activity Feed Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                📋 Pengumpulan Tugas Siswa Perlu Penilaian
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Klik aksi "Beri Nilai" untuk mengisi skor angka dan masukan koreksi.
              </p>
            </div>
          </div>

          {pendingGrades.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Belum ada berkas tugas yang dikumpulkan siswa.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Siswa</th>
                  <th>Judul Tugas</th>
                  <th>Waktu Upload</th>
                  <th>File Lampiran</th>
                  <th>Status Nilai</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingGrades.map((sub, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{sub.studentName}</td>
                    <td>{sub.assignmentTitle}</td>
                    <td style={{ fontSize: '0.8rem' }}>{sub.submittedAt}</td>
                    <td>
                      <span className="badge badge-primary">📁 {sub.fileUrl}</span>
                    </td>
                    <td>
                      {sub.score !== null ? (
                        <span className="badge badge-success">✓ Skor: {sub.score}</span>
                      ) : (
                        <span className="badge badge-warning">⏳ Belum Dinilai</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setScoreInput(sub.score || 90);
                          setFeedbackInput(sub.feedback || 'Sangat baik dan lengkap!');
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit3 size={14} /> {sub.score !== null ? 'Edit Nilai' : 'Beri Nilai'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Realtime Live Activity Stream Column */}
        <RealtimeActivityFeed />
      </div>

      {/* Grade Input Modal */}
      {selectedSubmission && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-card" style={{ width: '450px', padding: '1.5rem', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Penilaian Tugas: {selectedSubmission.studentName}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {selectedSubmission.assignmentTitle}
            </p>

            <form onSubmit={handleGradeSubmit}>
              <div className="form-group">
                <label className="form-label">Skor Nilai (0 - 100):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catatan & Feedback Guru:</label>
                <textarea
                  rows="3"
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setSelectedSubmission(null)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
