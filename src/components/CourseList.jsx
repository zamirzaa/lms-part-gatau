import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  Download,
  PlusCircle,
  MessageSquare,
  Clock,
  User,
  Search,
  CheckCircle,
  PlayCircle,
  HelpCircle,
  Award,
  CheckCircle2,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { apiService } from '../services/apiService';

export default function CourseList({ currentUser, courses, setCourses, modules, setModules, assignments }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('materi'); // materi, tugas, kuis, diskusi
  const [filterMajor, setFilterMajor] = useState('All');
  const [showAddModModal, setShowAddModModal] = useState(false);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);

  // Quizzes state per course
  const [courseQuizzes, setCourseQuizzes] = useState([
    {
      id: 'qz-1',
      courseId: 'crs-pwb',
      title: 'Kuis Latihan 1: Component & Props',
      timeLimit: 15,
      questions: [
        {
          id: 'q-qz-1',
          question: 'Bagaimana cara mendaftarkan event handler onClick di React?',
          options: ['onClick={handleClick}', 'onclick="handleClick()"', 'on:click="handleClick"', 'click={handleClick}'],
          correctOption: 0
        },
        {
          id: 'q-qz-2',
          question: 'Apa kegunaan properti "key" pada perulangan list elemen React?',
          options: ['Memberikan warna unik', 'Membantu React mengidentifikasi item mana yang berubah', 'Mempercepat kecepatan internet', 'Mencegah syntax error CSS'],
          correctOption: 1
        }
      ]
    }
  ]);

  // Quiz Attempt State for Student
  const [activeQuizSession, setActiveQuizSession] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  // New Module Form State
  const [newModForm, setNewModForm] = useState({
    title: '',
    type: 'pdf',
    fileUrl: '',
    videoUrl: '',
    content: ''
  });

  // New Custom Quiz Form State for Teacher
  const [newQuizForm, setNewQuizForm] = useState({
    title: '',
    timeLimit: 15,
    questions: [
      {
        id: `q-qz-new-1`,
        question: 'Tuliskan soal latihan di sini...',
        options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
        correctOption: 0
      }
    ]
  });

  const filteredCourses = courses.filter(c => {
    if (filterMajor === 'All') return true;
    return c.major.includes(filterMajor);
  });

  const courseModules = selectedCourse ? modules.filter(m => m.courseId === selectedCourse.id) : [];
  const courseAssignments = selectedCourse ? assignments.filter(a => a.courseId === selectedCourse.id) : [];
  const activeCourseQuizzes = selectedCourse ? courseQuizzes.filter(q => q.courseId === selectedCourse.id) : [];

  const handleAddModule = (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const newMod = {
      id: `mod-${Date.now()}`,
      courseId: selectedCourse.id,
      title: newModForm.title,
      type: newModForm.type,
      fileUrl: newModForm.fileUrl || '#',
      videoUrl: newModForm.videoUrl || '',
      content: newModForm.content,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const updated = apiService.addModule(newMod);
    setModules(updated);
    setShowAddModModal(false);
    setNewModForm({ title: '', type: 'pdf', fileUrl: '', videoUrl: '', content: '' });
    alert("Modul materi baru berhasil diunggah!");
  };

  const handleAddQuiz = (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (newQuizForm.questions.length === 0) {
      alert("Harap tambahkan minimal 1 soal untuk kuis ini!");
      return;
    }

    const createdQuiz = {
      id: `qz-${Date.now()}`,
      courseId: selectedCourse.id,
      title: newQuizForm.title,
      timeLimit: Number(newQuizForm.timeLimit),
      questions: newQuizForm.questions
    };

    setCourseQuizzes([createdQuiz, ...courseQuizzes]);
    setShowAddQuizModal(false);
    setNewQuizForm({
      title: '',
      timeLimit: 15,
      questions: [
        {
          id: `q-qz-new-1`,
          question: '',
          options: ['', '', '', ''],
          correctOption: 0
        }
      ]
    });
    alert(`Kuis & Latihan Soal "${createdQuiz.title}" berhasil ditambahkan ke mata pelajaran!`);
  };

  const handleAddQuizQuestion = () => {
    setNewQuizForm({
      ...newQuizForm,
      questions: [
        ...newQuizForm.questions,
        {
          id: `q-qz-new-${Date.now()}`,
          question: '',
          options: ['', '', '', ''],
          correctOption: 0
        }
      ]
    });
  };

  const handleRemoveQuizQuestion = (idx) => {
    const updated = newQuizForm.questions.filter((_, qIdx) => qIdx !== idx);
    setNewQuizForm({ ...newQuizForm, questions: updated });
  };

  const handleQuizSubmit = (quiz) => {
    let correct = 0;
    quiz.questions.forEach(q => {
      const given = quizAnswers[q.id];
      if (given !== undefined && Number(given) === Number(q.correctOption)) {
        correct++;
      }
    });
    const calculatedScore = Math.round((correct / quiz.questions.length) * 100);
    setQuizScore({ score: calculatedScore, correct, total: quiz.questions.length });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            📚 Mata Pelajaran & Modul Digital
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Pilih mata pelajaran untuk mengakses modul PDF, video tutorial, kuis kustom, dan diskusi.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'RPL', 'TKJ', 'Umum'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterMajor(cat)}
              className={`btn btn-sm ${filterMajor === cat ? 'btn-primary' : 'btn-outline'}`}
            >
              {cat === 'All' ? 'Semua Mapel' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {filteredCourses.map(crs => (
          <div key={crs.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '140px' }}>
              <img src={crs.thumbnail} alt={crs.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                <span className="badge badge-primary">{crs.code}</span>
              </div>
            </div>

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{crs.major} • {crs.classRoom}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--text-main)' }}>
                  {crs.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.4 }}>
                  {crs.description}
                </p>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User size={14} /> {crs.teacherName.split(',')[0]}
                </div>
                <button
                  onClick={() => {
                    setSelectedCourse(crs);
                    setActiveTab('materi');
                    setActiveQuizSession(null);
                    setQuizScore(null);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Buka Mapel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal View */}
      {selectedCourse && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{ width: '920px', maxHeight: '92vh', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-warning" style={{ color: 'white', background: 'rgba(255,255,255,0.2)' }}>{selectedCourse.code}</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.25rem' }}>{selectedCourse.title}</h3>
                <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Pengajar: {selectedCourse.teacherName}</p>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
                Tutup (✕)
              </button>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-main)', padding: '0 1.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'materi', label: '📖 Modul & Materi Pembelajaran', count: courseModules.length },
                { id: 'tugas', label: '📝 Daftar Tugas', count: courseAssignments.length },
                { id: 'kuis', label: '🎯 Kuis & Latihan Soal', count: activeCourseQuizzes.length },
                { id: 'diskusi', label: '💬 Forum Diskusi Kelas', count: 4 }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    setActiveQuizSession(null);
                    setQuizScore(null);
                  }}
                  style={{
                    padding: '0.85rem 1.25rem',
                    border: 'none',
                    borderBottom: activeTab === t.id ? '3px solid var(--primary)' : '3px solid transparent',
                    background: 'transparent',
                    color: activeTab === t.id ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: activeTab === t.id ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.88rem'
                  }}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {/* TAB 1: MATERI */}
              {activeTab === 'materi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(currentUser.role === 'guru' || currentUser.role === 'admin') && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => setShowAddModModal(true)} className="btn btn-primary btn-sm">
                        <PlusCircle size={16} /> Unggah Modul Materi Baru
                      </button>
                    </div>
                  )}

                  {courseModules.map(mod => (
                    <div key={mod.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: mod.type === 'video' ? 'var(--danger-light)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mod.type === 'video' ? 'var(--danger)' : 'var(--primary)' }}>
                          {mod.type === 'video' ? <Video size={22} /> : <FileText size={22} />}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>{mod.title}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{mod.content}</p>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem', display: 'block' }}>Rilis: {mod.dateAdded}</span>
                        </div>
                      </div>

                      <div>
                        {mod.type === 'video' ? (
                          <a href={mod.videoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                            <PlayCircle size={14} /> Tonton Video
                          </a>
                        ) : (
                          <button onClick={() => alert(`Mengunduh berkas ${mod.title}...`)} className="btn btn-outline btn-sm">
                            <Download size={14} /> Unduh PDF
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: TUGAS */}
              {activeTab === 'tugas' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {courseAssignments.map(asg => (
                    <div key={asg.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{asg.title}</h4>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{asg.description}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600, display: 'block', marginTop: '0.4rem' }}>
                            ⏳ Batas Waktu: {asg.deadline}
                          </span>
                        </div>
                        <span className="badge badge-primary">Nilai Maks: {asg.maxScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: KUIS & LATIHAN SOAL PER MAPEL */}
              {activeTab === 'kuis' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        🎯 Kuis & Latihan Soal Pembelajaran Mapel
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Guru dapat membuat kuis kustom dengan soal dan opsi jawaban yang disesuaikan sendiri.
                      </p>
                    </div>

                    {(currentUser.role === 'guru' || currentUser.role === 'admin') && (
                      <button onClick={() => setShowAddQuizModal(true)} className="btn btn-primary btn-sm">
                        <PlusCircle size={16} /> Buat Kuis / Soal Baru
                      </button>
                    )}
                  </div>

                  {/* ACTIVE QUIZ SESSION */}
                  {activeQuizSession ? (
                    <div className="card" style={{ background: 'var(--bg-main)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {activeQuizSession.title}
                        </h4>
                        <button onClick={() => setActiveQuizSession(null)} className="btn btn-outline btn-sm">
                          Tutup Kuis
                        </button>
                      </div>

                      {quizScore ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>{quizScore.score}</div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Benar {quizScore.correct} dari {quizScore.total} Soal
                          </p>
                          <div style={{ marginTop: '1rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>
                            ✓ Jawaban Kuis Telah Berhasil Disubmit
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          {activeQuizSession.questions.map((q, qIdx) => (
                            <div key={q.id} style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                                Soal {qIdx + 1}: {q.question}
                              </h5>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {q.options.map((opt, oIdx) => (
                                  <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                                    <input
                                      type="radio"
                                      name={`quiz-${q.id}`}
                                      checked={Number(quizAnswers[q.id]) === oIdx}
                                      onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: oIdx })}
                                    />
                                    <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}

                          <button onClick={() => handleQuizSubmit(activeQuizSession)} className="btn btn-primary">
                            Kirim Jawaban Kuis
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {activeCourseQuizzes.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          Belum ada kuis kustom yang dibuat untuk mata pelajaran ini. Guru dapat mengklik "Buat Kuis / Soal Baru".
                        </div>
                      ) : (
                        activeCourseQuizzes.map(qz => (
                          <div key={qz.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span className="badge badge-primary">{qz.questions.length} Soal</span>
                              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--text-main)' }}>{qz.title}</h4>
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Estimasi Waktu: {qz.timeLimit} Menit</p>
                            </div>
                            <button onClick={() => { setActiveQuizSession(qz); setQuizAnswers({}); setQuizScore(null); }} className="btn btn-secondary btn-sm">
                              Kerjakan Kuis
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: DISKUSI */}
              {activeTab === 'diskusi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="card" style={{ background: 'var(--bg-main)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                      <div style={{ flex: 1 }}>
                        <textarea placeholder="Tuliskan pertanyaan atau tanggapan diskusi..." className="form-textarea" rows="2" style={{ width: '100%' }} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                          <button className="btn btn-primary btn-sm">Kirim Diskusi</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM QUIZ MODAL FOR TEACHER */}
      {showAddQuizModal && (
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
          <div className="glass-card" style={{ width: '750px', maxHeight: '90vh', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>🎯 Buat Kuis & Latihan Soal Kustom</h3>
              <button onClick={() => setShowAddQuizModal(false)} className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '0.3rem 0.6rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddQuiz} style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Judul Kuis / Latihan:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kuis Latihan 2 - Props & State"
                    value={newQuizForm.title}
                    onChange={(e) => setNewQuizForm({ ...newQuizForm, title: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimasi Waktu (Menit):</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={newQuizForm.timeLimit}
                    onChange={(e) => setNewQuizForm({ ...newQuizForm, timeLimit: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Questions Manager */}
              <div style={{ marginTop: '0.5rem', borderTop: '2px dashed var(--border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Daftar Pertanyaan Kuis ({newQuizForm.questions.length})</h4>
                  <button type="button" onClick={handleAddQuizQuestion} className="btn btn-secondary btn-sm">
                    <Plus size={14} /> Tambah Pertanyaan
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {newQuizForm.questions.map((q, qIdx) => (
                    <div key={q.id} className="card" style={{ background: 'var(--bg-main)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className="badge badge-primary">Pertanyaan #{qIdx + 1}</span>
                        {newQuizForm.questions.length > 1 && (
                          <button type="button" onClick={() => handleRemoveQuizQuestion(qIdx)} className="btn btn-danger btn-sm">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Pertanyaan:</label>
                        <input
                          type="text"
                          placeholder="Tulis pertanyaan..."
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...newQuizForm.questions];
                            updated[qIdx].question = e.target.value;
                            setNewQuizForm({ ...newQuizForm, questions: updated });
                          }}
                          className="form-input"
                          required
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <label className="form-label">Opsi Jawaban & Tandai Jawaban Benar:</label>
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="radio"
                              name={`correct-qz-${q.id}`}
                              checked={Number(q.correctOption) === oIdx}
                              onChange={() => {
                                const updated = [...newQuizForm.questions];
                                updated[qIdx].correctOption = oIdx;
                                setNewQuizForm({ ...newQuizForm, questions: updated });
                              }}
                            />
                            <span style={{ fontWeight: 700 }}>{String.fromCharCode(65 + oIdx)}.</span>
                            <input
                              type="text"
                              placeholder={`Opsi ${String.fromCharCode(65 + oIdx)}`}
                              value={opt}
                              onChange={(e) => {
                                const updated = [...newQuizForm.questions];
                                updated[qIdx].options[oIdx] = e.target.value;
                                setNewQuizForm({ ...newQuizForm, questions: updated });
                              }}
                              className="form-input"
                              style={{ flex: 1 }}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <button type="button" onClick={() => setShowAddQuizModal(false)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Kuis Per Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MODULE MODAL */}
      {showAddModModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-card" style={{ width: '450px', padding: '1.5rem', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
              Unggah Modul Pembelajaran Baru
            </h3>
            <form onSubmit={handleAddModule}>
              <div className="form-group">
                <label className="form-label">Judul Modul Materi:</label>
                <input
                  type="text"
                  placeholder="Contoh: Modul 2 - State Management"
                  value={newModForm.title}
                  onChange={(e) => setNewModForm({ ...newModForm, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipe Berkas:</label>
                <select
                  value={newModForm.type}
                  onChange={(e) => setNewModForm({ ...newModForm, type: e.target.value })}
                  className="form-select"
                >
                  <option value="pdf">Dokumen PDF / Slide Presentation</option>
                  <option value="video">Video Tutorial Online (YouTube / Link)</option>
                </select>
              </div>

              {newModForm.type === 'video' ? (
                <div className="form-group">
                  <label className="form-label">URL Video Embed:</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/embed/..."
                    value={newModForm.videoUrl}
                    onChange={(e) => setNewModForm({ ...newModForm, videoUrl: e.target.value })}
                    className="form-input"
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Pilih Dokumen PDF:</label>
                  <input type="file" accept=".pdf,.doc,.docx" className="form-input" />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Deskripsi & Penjelasan singkat:</label>
                <textarea
                  rows="3"
                  value={newModForm.content}
                  onChange={(e) => setNewModForm({ ...newModForm, content: e.target.value })}
                  className="form-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModModal(false)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload Modul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
