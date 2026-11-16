import React, { useState, useEffect, useRef } from 'react';
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
  X,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Maximize2,
  AlertTriangle,
  RotateCcw,
  Eye,
  Info
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

  // CBT Screen Lock & Anti-Cheat State
  const [violationLogs, setViolationLogs] = useState([]);
  const [isExamLocked, setIsExamLocked] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [latestWarningReason, setLatestWarningReason] = useState('');
  const [lockedSessions, setLockedSessions] = useState(() => apiService.getCbtLockSessions());
  const [selectedStudentLockDetail, setSelectedStudentLockDetail] = useState(null);

  // Modal State for Create/Edit Exam
  const [showExamModal, setShowExamModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);

  // Form state for Exam Details & Question List
  const [examForm, setExamForm] = useState({
    title: '',
    courseTitle: 'SIJA : Network Engineering',
    durationMinutes: 45,
    passScore: 75,
    status: 'active',
    questions: []
  });

  const lastViolationTimeRef = useRef(0);

  // Refresh locked sessions on mount or interval
  useEffect(() => {
    setLockedSessions(apiService.getCbtLockSessions());
  }, [activeExamSession, isExamLocked]);

  // Countdown Timer Hook (Only runs when not locked and not finished)
  useEffect(() => {
    let timerInterval = null;
    if (activeExamSession && !examResult && !isExamLocked) {
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
  }, [activeExamSession, examResult, isExamLocked]);

  // Request Fullscreen Helper
  const enterFullscreen = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request error:", err);
    }
  };

  // Anti-Cheat Screen Lock Monitoring Hook
  useEffect(() => {
    if (!activeExamSession || examResult || isExamLocked) return;

    const triggerViolation = (reason) => {
      const now = Date.now();
      // Debounce by 1500ms so a tab switch doesn't double-trigger window.blur + visibilitychange
      if (now - lastViolationTimeRef.current < 1500) return;
      lastViolationTimeRef.current = now;

      const timeStr = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' WIB';

      setViolationLogs(prev => {
        const newAttempt = prev.length + 1;
        const newLog = { attempt: newAttempt, reason, time: timeStr };
        const updatedLogs = [...prev, newLog];

        if (newAttempt >= 3) {
          // 3rd VIOLATION -> HARD LOCK
          setIsExamLocked(true);
          setShowWarningModal(false);
          apiService.lockCbtSession({
            studentId: currentUser.id,
            studentName: currentUser.name,
            studentIdentityNo: currentUser.identityNo,
            classRoom: currentUser.classRoom || 'XII SIJA 2',
            examId: activeExamSession.id,
            examTitle: activeExamSession.title,
            violationLogs: updatedLogs
          });
          setLockedSessions(apiService.getCbtLockSessions());
        } else {
          // 1st or 2nd VIOLATION -> WARNING MODAL
          setLatestWarningReason(reason);
          setShowWarningModal(true);
        }

        return updatedLogs;
      });
    };

    // 1. Tab Switch / Window Minimize
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation("Beralih tab atau meminimalkan jendela browser");
      }
    };

    // 2. Window Blur (Alt+Tab, Clicking outside, Opening other software)
    const handleWindowBlur = () => {
      triggerViolation("Jendela ujian kehilangan fokus / membuka aplikasi lain");
    };

    // 3. Fullscreen Exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isExamLocked && !examResult) {
        triggerViolation("Keluar dari mode layar penuh (Fullscreen)");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [activeExamSession, examResult, isExamLocked, currentUser]);

  const startExam = (exam) => {
    if (!exam.questions || exam.questions.length === 0) {
      alert("Paket ujian ini belum memiliki soal! Guru perlu mengisi soal terlebih dahulu.");
      return;
    }

    // Check if student is currently locked for this exam
    const existingLock = apiService.getCbtLockForStudent(currentUser.id, exam.id);
    if (existingLock) {
      setActiveExamSession(exam);
      setIsExamLocked(true);
      setViolationLogs(existingLock.violationLogs || []);
      return;
    }

    setActiveExamSession(exam);
    setCurrentQIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setExamResult(null);
    setViolationLogs([]);
    setIsExamLocked(false);
    setShowWarningModal(false);

    // Auto-enter Fullscreen on start
    enterFullscreen();
  };

  const handleDismissWarning = () => {
    setShowWarningModal(false);
    enterFullscreen();
  };

  const handleCheckUnlockStatus = () => {
    if (!activeExamSession) return;
    const currentLock = apiService.getCbtLockForStudent(currentUser.id, activeExamSession.id);
    if (!currentLock) {
      alert("Kunci ujian Anda telah DIBUKA oleh Administrator/Pengawas! Anda dapat melanjutkan ujian.");
      setIsExamLocked(false);
      setViolationLogs([]);
      enterFullscreen();
    } else {
      alert("Status: Ujian Anda masih TERKUNCI. Silakan hubungi Panitia/Admin Kurikulum di ruang panitia untuk membuka kunci.");
    }
  };

  const handleUnlockStudentByAdmin = (studentId, examId, studentName) => {
    if (window.confirm(`Buka kunci CBT untuk siswa ${studentName}? Siswa akan dapat melanjutkan ujian.`)) {
      apiService.unlockCbtSession(studentId, examId);
      setLockedSessions(apiService.getCbtLockSessions());
      setSelectedStudentLockDetail(null);
      alert(`Kunci ujian untuk ${studentName} berhasil dibuka.`);
    }
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

    // Exit fullscreen on submit
    try {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    } catch (err) {}

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
      courseTitle: 'SIJA : Network Engineering',
      durationMinutes: 45,
      passScore: 75,
      status: 'active',
      questions: [
        {
          id: `q-${Date.now()}-1`,
          type: 'mc',
          question: 'Manakah port standar protokol SSH untuk remote server terenkripsi?',
          options: ['Port 21', 'Port 22', 'Port 23', 'Port 80'],
          correctOption: 1,
          explanation: 'Port 22 digunakan oleh protokol SSH.'
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
      const updatedExam = {
        id: editingExamId,
        title: examForm.title,
        courseId: 'crs-aij',
        courseTitle: examForm.courseTitle,
        durationMinutes: Number(examForm.durationMinutes),
        totalQuestions: examForm.questions.length,
        status: examForm.status,
        passScore: Number(examForm.passScore),
        classRoom: 'XII SIJA 2',
        screenLockRequired: true,
        maxWarnings: 3,
        questions: examForm.questions
      };

      const updatedList = apiService.updateExam(updatedExam);
      setExams(updatedList);
      alert(`Paket Ujian CBT "${examForm.title}" berhasil diperbarui!`);
    } else {
      const createdExam = {
        id: `cbt-${Date.now()}`,
        title: examForm.title,
        courseId: 'crs-aij',
        courseTitle: examForm.courseTitle,
        durationMinutes: Number(examForm.durationMinutes),
        totalQuestions: examForm.questions.length,
        status: examForm.status,
        passScore: Number(examForm.passScore),
        classRoom: 'XII SIJA 2',
        screenLockRequired: true,
        maxWarnings: 3,
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
  // RENDER 2A: HARD LOCKOUT VIEW (PELANGGARAN KE-3)
  // ----------------------------------------------------
  if (activeExamSession && isExamLocked) {
    return (
      <div className="card" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2.5rem 2rem',
        borderRadius: '20px',
        border: '2px solid #ef4444',
        boxShadow: '0 20px 40px -10px rgba(239, 68, 68, 0.3)',
        background: 'var(--bg-card)'
      }}>
        {/* Red Shield Lock Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.12)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          border: '2px solid rgba(239, 68, 68, 0.3)'
        }}>
          <Lock size={40} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span className="badge badge-danger" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
            SCREEN LOCK AKTIF • UJIAN TERKUNCI
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ef4444', margin: '0.5rem 0' }}>
            UJIAN CBT TERKUNCI OLEH SISTEM
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.5 }}>
            Sesi ujian Anda atas nama <strong>{currentUser.name}</strong> ({currentUser.identityNo}) pada paket <strong>{activeExamSession.title}</strong> telah dikunci otomatis karena terdeteksi <strong>3 kali pelanggaran integritas ujian</strong>.
          </p>
        </div>

        {/* Reason Table */}
        <div style={{
          background: 'var(--bg-main)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} />
            Riwayat & Alasan Pelanggaran yang Terdeteksi:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {violationLogs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}>
                    {log.attempt}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.reason}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Prompt */}
        <div style={{
          padding: '1rem',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#b45309',
          fontSize: '0.88rem',
          lineHeight: 1.5,
          marginBottom: '1.75rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Langkah untuk Melanjutkan Ujian:</strong><br />
            Silakan menghadap ke <strong>Pengawas Ujian / Administrator Kurikulum</strong> di ruang panitia CBT. Pengawas akan memverifikasi riwayat pelanggaran Anda dan melakukan <em>Unlock</em> melalui Panel Admin.
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={handleCheckUnlockStatus}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: 700 }}
          >
            <RotateCcw size={16} />
            <span>Periksa Status Buka Kunci</span>
          </button>

          <button
            onClick={() => { setActiveExamSession(null); setIsExamLocked(false); }}
            className="btn btn-outline"
          >
            Kembali ke Menu Utama
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER 2B: ACTIVE EXAM TAKING SESSION (WITH SCREEN LOCK)
  // ----------------------------------------------------
  if (activeExamSession) {
    const questions = activeExamSession.questions || [];
    const currentQ = questions[currentQIndex];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top CBT Bar with Screen Lock Status */}
        <div className="card" style={{
          padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-primary">CBT LIVE SYSTEM</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <ShieldCheck size={14} /> SCREEN LOCK AKTIF
            </span>

            {/* Warning Counter Pill */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              background: violationLogs.length === 0 ? 'rgba(59, 130, 246, 0.1)' : violationLogs.length === 1 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: violationLogs.length === 0 ? '#3b82f6' : violationLogs.length === 1 ? '#d97706' : '#ef4444',
              border: '1px solid currentColor'
            }}>
              <AlertTriangle size={13} /> Peringatan: {violationLogs.length} / 3
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={enterFullscreen}
              className="btn btn-outline btn-sm"
              title="Perluas Layar Penuh"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Maximize2 size={14} /> Fullscreen
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: timeLeftSeconds < 300 ? 'var(--danger-light)' : 'var(--accent-gold-light)',
              color: timeLeftSeconds < 300 ? 'var(--danger)' : '#b45309',
              padding: '0.5rem 1rem', borderRadius: '9999px', fontWeight: 800, fontSize: '1.05rem'
            }}>
              <Clock size={18} />
              <span>Sisa Waktu: {formatTime(timeLeftSeconds)}</span>
            </div>
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

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
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
                  Soal Berikutnya <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExamAuto}
                  className="btn btn-primary"
                  style={{ background: '#10b981', borderColor: '#10b981' }}
                >
                  <CheckCircle2 size={16} /> Selesai & Kirim Ujian
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

        {/* WARNING MODAL (ATTEMPT 1 & 2) */}
        {showWarningModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <div style={{
              background: '#1e293b',
              color: '#ffffff',
              borderRadius: '20px',
              border: '2px solid #f59e0b',
              boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.4)',
              width: '100%',
              maxWidth: '520px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '65px',
                height: '65px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <AlertTriangle size={36} />
              </div>

              <span className="badge badge-warning" style={{ fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                PERINGATAN INTEGRITAS {violationLogs.length} DARI 3
              </span>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.65rem 0', color: '#fef3c7' }}>
                PERINGATAN SCREEN LOCK!
              </h3>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '0.85rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.88rem',
                margin: '1rem 0',
                textAlign: 'left'
              }}>
                <div style={{ color: '#fca5a5', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Pelanggaran Terdeteksi:
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>
                  {latestWarningReason}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  Waktu: {new Date().toLocaleTimeString('id-ID')} WIB
                </div>
              </div>

              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Anda dilarang berpindah tab, meminimalkan jendela, atau membuka aplikasi lain selama ujian berlangsung.
                Sisa <strong>{3 - violationLogs.length} kesempatan</strong> sebelum ujian Anda <strong>TERKUNCI PERMANEN</strong> dan harus menghadap panitia!
              </p>

              <button
                onClick={handleDismissWarning}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  background: '#f59e0b',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                Saya Mengerti & Kembali ke Layar Penuh
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER 3: EXAM LIST MENU (DEFAULT VIEW)
  // ----------------------------------------------------
  const activeLocks = lockedSessions.filter(l => l.isLocked);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            💻 Computer-Based Test (Ujian Online CBT)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Pelaksanaan Ujian Online Kelas XII SIJA 2 Dilengkapi Fitur <strong>Screen Lock Anti-Cheat</strong> SMKN 1 Cibinong.
          </p>
        </div>

        {(currentUser.role === 'guru' || currentUser.role === 'admin') && (
          <button onClick={openCreateModal} className="btn btn-primary">
            <PlusCircle size={16} /> Buat Paket Ujian & Atur Soal
          </button>
        )}
      </div>

      {/* ADMIN & GURU: CBT LOCK MONITOR PANEL */}
      {(currentUser.role === 'guru' || currentUser.role === 'admin') && activeLocks.length > 0 && (
        <div className="card" style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldAlert size={22} style={{ color: '#ef4444' }} />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ef4444' }}>
                  🚨 Pengawasan CBT: {activeLocks.length} Siswa Terkunci (Screen Lockout)
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Siswa berikut telah melakukan 3 kali pelanggaran. Klik Buka Kunci (Unlock) setelah memverifikasi alasan.
                </p>
              </div>
            </div>
            <span className="badge badge-danger">{activeLocks.length} Menunggu Unlock</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Nama Siswa</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>NIS</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Kelas</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Paket Ujian</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Waktu Kunci</th>
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {activeLocks.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>{l.studentName}</td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>{l.studentIdentityNo}</td>
                    <td style={{ padding: '0.65rem 0.85rem' }}><span className="badge badge-primary">{l.classRoom}</span></td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>{l.examTitle}</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#ef4444', fontWeight: 600 }}>{l.lockedAt}</td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => setSelectedStudentLockDetail(l)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.35rem' }}
                        >
                          <Eye size={13} /> Lihat 3 Alasan
                        </button>
                        <button
                          onClick={() => handleUnlockStudentByAdmin(l.studentId, l.examId, l.studentName)}
                          className="btn btn-sm"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            gap: '0.35rem'
                          }}
                        >
                          <Unlock size={13} /> Buka Kunci (Unlock)
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exam Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {exams.map(exam => {
          const isStudentLocked = currentUser.role === 'siswa' && apiService.getCbtLockForStudent(currentUser.id, exam.id);

          return (
            <div key={exam.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{exam.courseTitle}</span>
                  {isStudentLocked ? (
                    <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Lock size={12} /> TERKUNCI (SCREEN LOCK)
                    </span>
                  ) : (
                    <span className={`badge ${exam.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {exam.status === 'active' ? '● ONLINE AKTIF' : 'MENDATANG'}
                    </span>
                  )}
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
                    <ShieldCheck size={14} style={{ color: '#10b981' }} /> Screen Lock (Max 3)
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  disabled={exam.status !== 'active'}
                  onClick={() => startExam(exam)}
                  className={`btn ${isStudentLocked ? 'btn-danger' : 'btn-primary'}`}
                  style={{ flex: 1 }}
                >
                  {isStudentLocked ? (
                    <>
                      <Lock size={16} /> Ujian Terkunci (Buka Sesi)
                    </>
                  ) : (
                    <>
                      Mulai Ujian <ArrowRight size={16} />
                    </>
                  )}
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
          );
        })}
      </div>

      {/* REASONS DETAIL MODAL FOR ADMIN / GURU */}
      {selectedStudentLockDetail && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '580px',
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} style={{ color: '#ef4444' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                  Detail 3 Alasan Pelanggaran Screen Lock
                </h3>
              </div>
              <button onClick={() => setSelectedStudentLockDetail(null)} className="btn btn-sm btn-outline">
                <X size={16} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <p style={{ margin: '0 0 0.35rem 0' }}>Nama: <strong>{selectedStudentLockDetail.studentName}</strong></p>
              <p style={{ margin: '0 0 0.35rem 0' }}>NIS: <strong>{selectedStudentLockDetail.studentIdentityNo}</strong> • Kelas: <strong>{selectedStudentLockDetail.classRoom}</strong></p>
              <p style={{ margin: 0 }}>Ujian: <strong>{selectedStudentLockDetail.examTitle}</strong></p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
              {(selectedStudentLockDetail.violationLogs || []).map((v, vIdx) => (
                <div
                  key={vIdx}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(239,68,68,0.2)',
                    background: 'rgba(239,68,68,0.06)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 800, color: '#ef4444' }}>Pelanggaran #{v.attempt}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{v.time}</span>
                  </div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{v.reason}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setSelectedStudentLockDetail(null)}
                className="btn btn-outline"
              >
                Tutup
              </button>
              <button
                onClick={() => handleUnlockStudentByAdmin(
                  selectedStudentLockDetail.studentId,
                  selectedStudentLockDetail.examId,
                  selectedStudentLockDetail.studentName
                )}
                className="btn btn-primary"
                style={{ background: '#10b981', borderColor: '#10b981', gap: '0.5rem' }}
              >
                <Unlock size={16} /> Buka Kunci Siswa Ini
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div className="card" style={{
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            padding: '2rem',
            borderRadius: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {editingExamId ? '✏️ Edit Paket Ujian & Atur Soal CBT' : '➕ Buat Paket Ujian CBT Baru & Atur Soal'}
              </h3>
              <button onClick={() => setShowExamModal(false)} className="btn btn-outline btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExam} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Judul Ujian</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ujian CBT SIJA : Network Engineering"
                    value={examForm.title}
                    onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={examForm.courseTitle}
                    onChange={(e) => setExamForm({ ...examForm, courseTitle: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Durasi (Menit)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    required
                    value={examForm.durationMinutes}
                    onChange={(e) => setExamForm({ ...examForm, durationMinutes: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Nilai KKM</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    required
                    value={examForm.passScore}
                    onChange={(e) => setExamForm({ ...examForm, passScore: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Status Ujian</label>
                  <select
                    value={examForm.status}
                    onChange={(e) => setExamForm({ ...examForm, status: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', marginTop: '0.35rem' }}
                  >
                    <option value="active">Online Aktif</option>
                    <option value="upcoming">Mendatang</option>
                  </select>
                </div>
              </div>

              {/* Question Builder Section */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                    Daftar Butir Soal ({examForm.questions.length} Soal)
                  </h4>
                  <button
                    type="button"
                    onClick={() => addQuestionToForm('mc')}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={15} /> Tambah Soal Pilihan Ganda
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {examForm.questions.map((q, qIdx) => (
                    <div
                      key={q.id || qIdx}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-main)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
                          Nomor {qIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeQuestionFromForm(qIdx)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Pertanyaan Soal</label>
                        <textarea
                          rows="2"
                          required
                          value={q.question}
                          onChange={(e) => updateQuestionField(qIdx, 'question', e.target.value)}
                          className="form-textarea"
                          style={{ width: '100%', marginTop: '0.25rem' }}
                        />
                      </div>

                      {q.type === 'mc' && (
                        <div>
                          <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                            Pilihan Opsi Jawaban (Pilih radio untuk menentukan kunci jawaban yang benar)
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <input
                                  type="radio"
                                  name={`correct-${q.id || qIdx}`}
                                  checked={Number(q.correctOption) === oIdx}
                                  onChange={() => updateQuestionField(qIdx, 'correctOption', oIdx)}
                                />
                                <span style={{ fontWeight: 700, fontSize: '0.85rem', width: '20px' }}>
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                <input
                                  type="text"
                                  required
                                  value={opt}
                                  onChange={(e) => updateOptionText(qIdx, oIdx, e.target.value)}
                                  className="form-input"
                                  style={{ flex: 1, padding: '0.45rem 0.75rem' }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="btn btn-outline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <CheckCircle2 size={16} /> Simpan Paket Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
