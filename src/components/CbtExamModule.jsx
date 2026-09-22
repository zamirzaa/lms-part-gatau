import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  HelpCircle,
  Flag,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  PlusCircle,
  Award,
  Sparkles,
  Trash2,
  Edit3,
  Plus,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiService } from '../services/apiService';

export default function CbtExamModule({ currentUser, exams, setExams }) {
  const [activeExamSession, setActiveExamSession] = useState(null); // Active taking exam
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [examResult, setExamResult] = useState(null);

  // Modal State for Create/Edit Exam
  const [showExamModal, setShowExamModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);

  // Form state for Exam Details & Question List
  const [examForm, setExamForm] = useState({
    title: '',
    courseTitle: 'Pemrograman Web & Bergerak',
    durationMinutes: 45,
    passScore: 75,
    status: 'active',
    questions: []
  });

  // Countdown Timer Hook
  useEffect(() => {
    let timerInterval = null;
    if (activeExamSession && !examResult) {
      timerInterval = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            handleSubmitExamAuto();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [activeExamSession, examResult]);

  const startExam = (exam) => {
    if (!exam.questions || exam.questions.length === 0) {
      alert("Paket ujian ini belum memiliki soal! Guru perlu mengisi soal terlebih dahulu.");
      return;
    }
    setActiveExamSession(exam);
    setCurrentQIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setExamResult(null);
  };

  const handleOptionSelect = (qId, optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const toggleFlagQuestion = (qId) => {
    setFlaggedQuestions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitExamAuto = () => {
    if (!activeExamSession) return;

    let correctCount = 0;
    const questions = activeExamSession.questions || [];

    questions.forEach(q => {
      if (q.type === 'mc') {
        const givenAns = userAnswers[q.id];
        if (givenAns !== undefined && Number(givenAns) === Number(q.correctOption)) {
          correctCount++;
        }
      }
    });

    const mcQuestionsCount = questions.filter(q => q.type === 'mc').length;
    const score = mcQuestionsCount > 0 ? Math.round((correctCount / mcQuestionsCount) * 100) : 100;
    const isPassed = score >= activeExamSession.passScore;

    const result = {
      id: `res-${Date.now()}`,
      examId: activeExamSession.id,
      examTitle: activeExamSession.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      score,
      correctCount,
      totalMcCount: mcQuestionsCount,
      isPassed,
      submittedAt: new Date().toLocaleString('id-ID')
    };

    apiService.saveExamResult(result);
    setExamResult(result);

    if (isPassed) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log("Confetti error:", err);
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Open Modal for Creating New Exam
  const openCreateModal = () => {
    setEditingExamId(null);
    setExamForm({
      title: '',
      courseTitle: 'Pemrograman Web & Bergerak',
      durationMinutes: 45,
      passScore: 75,
      status: 'active',
      questions: [
        {
          id: `q-${Date.now()}-1`,
          type: 'mc',
          question: 'Manakah perintah HTML yang benar untuk membuat heading tingkat 1?',
          options: ['<h1>', '<head>', '<heading>', '<h6>'],
          correctOption: 0,
          explanation: 'Tag <h1> digunakan untuk heading utama dokumen HTML.'
        }
      ]
    });
    setShowExamModal(true);
  };

  // Open Modal for Editing Existing Exam
  const openEditModal = (exam) => {
    setEditingExamId(exam.id);
    setExamForm({
      title: exam.title,
      courseTitle: exam.courseTitle,
      durationMinutes: exam.durationMinutes,
      passScore: exam.passScore,
      status: exam.status || 'active',
      questions: JSON.parse(JSON.stringify(exam.questions || []))
    });
    setShowExamModal(true);
  };

  // Delete Exam
  const handleDeleteExam = (examId, examTitle) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus paket Ujian CBT "${examTitle}"?`)) {
      const updated = apiService.deleteExam(examId);
      setExams(updated);
      alert("Paket Ujian berhasil dihapus.");
    }
  };

  // Add Question to Form
  const addQuestionToForm = (type = 'mc') => {
    const newQ = {
      id: `q-${Date.now()}-${examForm.questions.length + 1}`,
      type,
      question: '',
      options: type === 'mc' ? ['', '', '', ''] : [],
      correctOption: 0,
      explanation: ''
    };
    setExamForm({
      ...examForm,
      questions: [...examForm.questions, newQ]
    });
  };

  // Remove Question from Form
  const removeQuestionFromForm = (qIndex) => {
    const updatedQs = examForm.questions.filter((_, idx) => idx !== qIndex);
    setExamForm({ ...examForm, questions: updatedQs });
  };

  // Update Question Field in Form
  const updateQuestionField = (qIndex, field, value) => {
    const updatedQs = [...examForm.questions];
    updatedQs[qIndex][field] = value;
    setExamForm({ ...examForm, questions: updatedQs });
  };

  // Update Option Text in Form
  const updateOptionText = (qIndex, oIndex, value) => {
    const updatedQs = [...examForm.questions];
    updatedQs[qIndex].options[oIndex] = value;
    setExamForm({ ...examForm, questions: updatedQs });
  };

  // Save Exam (Create or Update)
  const handleSaveExam = (e) => {
    e.preventDefault();

    if (examForm.questions.length === 0) {
      alert("Harap tambahkan minimal 1 soal pada paket ujian ini!");
      return;
    }

    if (editingExamId) {
      // Update existing
      const updatedExam = {
        id: editingExamId,
        title: examForm.title,
        courseId: 'crs-pwb',
        courseTitle: examForm.courseTitle,
        durationMinutes: Number(examForm.durationMinutes),
        totalQuestions: examForm.questions.length,
        status: examForm.status,
        passScore: Number(examForm.passScore),
        questions: examForm.questions
      };

      const updatedList = apiService.updateExam(updatedExam);
      setExams(updatedList);
      alert(`Paket Ujian CBT "${examForm.title}" berhasil diperbarui!`);
    } else {
      // Create new
      const createdExam = {
        id: `cbt-${Date.now()}`,
        title: examForm.title,
        courseId: 'crs-pwb',
        courseTitle: examForm.courseTitle,
        durationMinutes: Number(examForm.durationMinutes),
        totalQuestions: examForm.questions.length,
        status: examForm.status,
        passScore: Number(examForm.passScore),
        questions: examForm.questions
      };

      const updatedList = apiService.addExam(createdExam);
      setExams(updatedList);
      alert(`Paket Ujian CBT baru "${examForm.title}" berhasil ditambahkan!`);
    }

    setShowExamModal(false);
  };

  // ----------------------------------------------------
  // RENDER 1: RESULT VIEW AFTER SUBMIT
  // ----------------------------------------------------
  if (examResult) {
    return (
      <div className="card" style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center', padding: '2.5rem 2rem' }}>
        <div style={{
          width: '70px', height: '70px', borderRadius: '50%',
          background: examResult.isPassed ? 'var(--success-light)' : 'var(--danger-light)',
          color: examResult.isPassed ? 'var(--success)' : 'var(--danger)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem'
        }}>
          {examResult.isPassed ? <Award size={36} /> : <AlertCircle size={36} />}
        </div>

        <span className={`badge ${examResult.isPassed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.85rem' }}>
          {examResult.isPassed ? 'LULUS UJIAN CBT' : 'BELUM MEMENUHI KKM'}
        </span>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-main)' }}>
          {examResult.examTitle}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Nama Siswa: <strong>{examResult.studentName}</strong> • Disubmit: {examResult.submittedAt}
        </p>

        {/* Score Display Card */}
        <div style={{
          background: 'var(--primary-light)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '1.5rem',
          margin: '1.5rem 0',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>NILAI AKHIR</div>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>{examResult.score}</div>
          </div>
          <div style={{ width: '1px', height: '50px', background: 'var(--border)' }}></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>BENAR / TOTAL</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {examResult.correctCount} / {examResult.totalMcCount}
            </div>
          </div>
          <div style={{ width: '1px', height: '50px', background: 'var(--border)' }}></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>KKM MINIMUM</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>75</div>
          </div>
        </div>

        <button onClick={() => { setActiveExamSession(null); setExamResult(null); }} className="btn btn-primary">
          <ArrowLeft size={16} /> Kembali ke Menu CBT
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER 2: ACTIVE EXAM TAKING SESSION
  // ----------------------------------------------------
  if (activeExamSession) {
    const questions = activeExamSession.questions || [];
    const currentQ = questions[currentQIndex];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Sticky CBT Bar */}
        <div className="glass-card" style={{
          position: 'sticky', top: '70px', zIndex: 30,
          padding: '0.85rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-card)'
        }}>
          <div>
            <span className="badge badge-primary">CBT LIVE SYSTEM</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {activeExamSession.title}
            </h3>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: timeLeftSeconds < 300 ? 'var(--danger-light)' : 'var(--accent-gold-light)',
            color: timeLeftSeconds < 300 ? 'var(--danger)' : '#b45309',
            padding: '0.5rem 1rem', borderRadius: '9999px', fontWeight: 800, fontSize: '1.1rem'
          }}>
            <Clock size={20} />
            <span>Sisa Waktu: {formatTime(timeLeftSeconds)}</span>
          </div>
        </div>

        {/* Main Exam Workspace Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem' }}>
          {/* Left Column: Question Area */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '450px' }}>
            {currentQ ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>
                    Soal Nomor {currentQIndex + 1} Dari {questions.length}
                  </span>

                  <button
                    onClick={() => toggleFlagQuestion(currentQ.id)}
                    className={`btn btn-sm ${flaggedQuestions[currentQ.id] ? 'btn-accent' : 'btn-outline'}`}
                  >
                    <Flag size={14} /> {flaggedQuestions[currentQ.id] ? 'Ragu-ragu (Ditandai)' : 'Tandai Ragu-ragu'}
                  </button>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {currentQ.question}
                </h4>

                {currentQ.type === 'mc' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {currentQ.options.map((opt, oIdx) => {
                      const isSelected = Number(userAnswers[currentQ.id]) === oIdx;
                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleOptionSelect(currentQ.id, oIdx)}
                          style={{
                            padding: '0.85rem 1.1rem',
                            borderRadius: '12px',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: isSelected ? 'var(--primary-light)' : 'var(--bg-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: isSelected ? 'var(--primary)' : 'white',
                            color: isSelected ? 'white' : 'var(--text-muted)',
                            fontWeight: 700, fontSize: '0.85rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            {String.fromCharCode(65 + oIdx)}
                          </div>
                          <span style={{ fontSize: '0.92rem', fontWeight: isSelected ? 700 : 500, color: 'var(--text-main)' }}>
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    rows="5"
                    placeholder="Tuliskan jawaban essay lengkap Anda di sini..."
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) => setUserAnswers({ ...userAnswers, [currentQ.id]: e.target.value })}
                    className="form-textarea"
                    style={{ width: '100%' }}
                  />
                )}
              </div>
            ) : (
              <div>Belum ada soal pada ujian ini.</div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="btn btn-outline"
              >
                <ArrowLeft size={16} /> Soal Sebelumnya
              </button>

              {currentQIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="btn btn-primary"
                >
                  Soal Selanjutnya <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (window.confirm("Apakah Anda yakin ingin mengakhiri dan mengumpulkan Ujian CBT ini?")) {
                      handleSubmitExamAuto();
                    }
                  }}
                  className="btn btn-accent"
                >
                  <CheckCircle2 size={16} /> Selesai & Submit Ujian
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Question Grid Navigator */}
          <div className="card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem' }}>
              Navigasi Nomor Soal
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQIndex;
                const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== '';
                const isFlagged = flaggedQuestions[q.id];

                let classNames = 'cbt-num-btn';
                if (isCurrent) classNames += ' active';
                else if (isFlagged) classNames += ' flagged';
                else if (isAnswered) classNames += ' answered';

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={classNames}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER 3: EXAM LIST MENU (DEFAULT VIEW WITH EDIT & DELETE)
  // ----------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            💻 Computer-Based Test (Ujian Online CBT)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Portal pelaksanaan Ujian Online, Kelola Soal CBT & Bank Soal SMKN 1 Cibinong.
          </p>
        </div>

        {(currentUser.role === 'guru' || currentUser.role === 'admin') && (
          <button onClick={openCreateModal} className="btn btn-primary">
            <PlusCircle size={16} /> Buat Paket Ujian & Atur Soal
          </button>
        )}
      </div>

      {/* Exam Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {exams.map(exam => (
          <div key={exam.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">{exam.courseTitle}</span>
                <span className={`badge ${exam.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                  {exam.status === 'active' ? '● ONLINE AKTIF' : 'MENDATANG'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                {exam.title}
              </h3>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} /> {exam.durationMinutes} Menit
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <HelpCircle size={14} /> {(exam.questions || []).length} Soal
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={14} /> KKM: {exam.passScore}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                disabled={exam.status !== 'active'}
                onClick={() => startExam(exam)}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Mulai Ujian <ArrowRight size={16} />
              </button>

              {(currentUser.role === 'guru' || currentUser.role === 'admin') && (
                <>
                  <button
                    onClick={() => openEditModal(exam)}
                    className="btn btn-secondary btn-sm"
                    title="Edit Paket Ujian & Atur Soal"
                  >
                    <Edit3 size={15} /> Edit Soal
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam.id, exam.title)}
                    className="btn btn-danger btn-sm"
                    title="Hapus Ujian"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE & EDIT EXAM & QUESTION BUILDER MODAL */}
      {showExamModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{ width: '850px', maxHeight: '90vh', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {editingExamId ? '📝 Edit Paket Ujian & Kelola Soal CBT' : '✨ Buat Paket Ujian CBT Baru & Atur Soal'}
              </h3>
              <button onClick={() => setShowExamModal(false)} className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '0.3rem 0.6rem' }}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSaveExam} style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Exam Info Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Judul Ujian CBT:</label>
                  <input
                    type="text"
                    placeholder="Contoh: UTS Pemrograman Web"
                    value={examForm.title}
                    onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status Ujian:</label>
                  <select
                    value={examForm.status}
                    onChange={(e) => setExamForm({ ...examForm, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="active">Active (Aktif)</option>
                    <option value="upcoming">Upcoming (Mendatang)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Durasi (Menit):</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={examForm.durationMinutes}
                    onChange={(e) => setExamForm({ ...examForm, durationMinutes: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">KKM Minimum:</label>
                  <input
                    type="number"
                    min="50"
                    max="95"
                    value={examForm.passScore}
                    onChange={(e) => setExamForm({ ...examForm, passScore: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Question Builder Section */}
              <div style={{ marginTop: '1rem', borderTop: '2px dashed var(--border)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      📋 Daftar Soal Ujian ({examForm.questions.length} Soal)
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Atur pertanyaan, pilihan jawaban A-D, dan tentukan kunci jawaban benar.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" onClick={() => addQuestionToForm('mc')} className="btn btn-secondary btn-sm">
                      <Plus size={14} /> Tambah Soal Pilihan Ganda
                    </button>
                    <button type="button" onClick={() => addQuestionToForm('essay')} className="btn btn-outline btn-sm">
                      <Plus size={14} /> Tambah Soal Essay
                    </button>
                  </div>
                </div>

                {/* Questions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {examForm.questions.map((q, qIdx) => (
                    <div key={q.id} className="card" style={{ background: 'var(--bg-main)', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className="badge badge-primary">Soal #{qIdx + 1} ({q.type === 'mc' ? 'Pilihan Ganda' : 'Essay'})</span>
                        <button
                          type="button"
                          onClick={() => removeQuestionFromForm(qIdx)}
                          className="btn btn-danger btn-sm"
                          title="Hapus Soal Ini"
                        >
                          <Trash2 size={14} /> Hapus Soal
                        </button>
                      </div>

                      {/* Question Content Input */}
                      <div className="form-group">
                        <label className="form-label">Teks Pertanyaan / Soal:</label>
                        <textarea
                          rows="2"
                          placeholder="Tuliskan pertanyaan di sini..."
                          value={q.question}
                          onChange={(e) => updateQuestionField(qIdx, 'question', e.target.value)}
                          className="form-textarea"
                          required
                        />
                      </div>

                      {/* Multiple Choice Options Builder */}
                      {q.type === 'mc' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
                          <label className="form-label">Pilihan Jawaban & Kunci Jawaban Benar:</label>
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={Number(q.correctOption) === oIdx}
                                onChange={() => updateQuestionField(qIdx, 'correctOption', oIdx)}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                title="Tandai sebagai Jawaban BENAR"
                              />
                              <span style={{ fontWeight: 700, width: '24px' }}>{String.fromCharCode(65 + oIdx)}.</span>
                              <input
                                type="text"
                                placeholder={`Pilihan opsi ${String.fromCharCode(65 + oIdx)}`}
                                value={opt}
                                onChange={(e) => updateOptionText(qIdx, oIdx, e.target.value)}
                                className="form-input"
                                style={{ flex: 1 }}
                                required
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Explanation Input */}
                      <div className="form-group" style={{ marginTop: '0.75rem' }}>
                        <label className="form-label">Pembahasan / Penjelasan Jawaban:</label>
                        <input
                          type="text"
                          placeholder="Penjelasan singkat untuk pembahasan hasil ujian..."
                          value={q.explanation || ''}
                          onChange={(e) => updateQuestionField(qIdx, 'explanation', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <button type="button" onClick={() => setShowExamModal(false)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingExamId ? 'Simpan Perubahan Soal & Paket Ujian' : 'Publikasikan Ujian & Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
