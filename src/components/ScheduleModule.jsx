import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Printer,
  Sparkles,
  BookOpen,
  Coffee,
  CheckCircle2,
  HeartHandshake,
  Layers,
  ChevronRight
} from 'lucide-react';
import { INITIAL_SCHEDULE } from '../services/mockData';

export default function ScheduleModule({ currentUser }) {
  const [activeBlok, setActiveBlok] = useState('blok1'); // 'blok1' or 'blok2'
  const [selectedDay, setSelectedDay] = useState('all'); // 'all', 'senin', 'selasa', 'rabu', 'kamis', 'jumat'

  const scheduleData = INITIAL_SCHEDULE;
  const currentBlokData = activeBlok === 'blok1' ? scheduleData.blok1 : scheduleData.blok2;

  const days = [
    { key: 'senin', label: 'Senin', color: '#10b981' },
    { key: 'selasa', label: 'Selasa', color: '#f59e0b' },
    { key: 'rabu', label: 'Rabu', color: '#3b82f6' },
    { key: 'kamis', label: 'Kamis', color: '#8b5cf6' },
    { key: 'jumat', label: 'Jumat', color: '#ec4899' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const getDayKokurikuler = (dayKey) => {
    const koku = scheduleData.kokurikuler[dayKey];
    if (!koku) return null;
    return activeBlok === 'blok1' ? koku.kejuruan : koku.umum;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(37, 99, 235, 0.85) 100%)',
        color: '#ffffff',
        border: 'none',
        padding: '1.75rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.05em'
            }}>
              JADWAL PEMBELAJARAN RESMI
            </span>
            <span style={{
              background: '#f59e0b',
              color: '#000000',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              KELAS XII SIJA 2
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.35rem 0', color: '#ffffff' }}>
            SMK NEGERI 1 CIBINONG
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9, fontWeight: 500 }}>
            Tahun Pelajaran 2026/2027 • Semester Ganjil • Ruang Teori & Laboratorium Kejuruan
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="no-print"
          style={{
            background: '#ffffff',
            color: '#1e3a8a',
            border: 'none',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease'
          }}
        >
          <Printer size={17} />
          <span>Cetak / PDF Jadwal</span>
        </button>
      </div>

      {/* Blok Switcher Pills */}
      <div className="no-print" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        backgroundColor: 'var(--bg-card)',
        padding: '0.5rem',
        borderRadius: '16px',
        border: '1px solid var(--border)'
      }}>
        <button
          onClick={() => setActiveBlok('blok1')}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            border: activeBlok === 'blok1' ? '2px solid #2563eb' : '1px solid transparent',
            background: activeBlok === 'blok1' ? 'var(--primary-light)' : 'transparent',
            color: activeBlok === 'blok1' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} />
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>BLOK 1: KEJURUAN SIJA</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Laboratorium: <strong>L.SIJA</strong> (SysAdmin, FTTx, Network Eng, Mobile Dev, DevOps, CCNA)
          </span>
        </button>

        <button
          onClick={() => setActiveBlok('blok2')}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            border: activeBlok === 'blok2' ? '2px solid #2563eb' : '1px solid transparent',
            background: activeBlok === 'blok2' ? 'var(--primary-light)' : 'transparent',
            color: activeBlok === 'blok2' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} />
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>BLOK 2: UMUM & NORMATIF ADAPTIF</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Ruang Teori: <strong>RT-18</strong> (Bahasa Inggris, PKK, B.Indo, Matematika, Pancasila, Sejarah, Jepang, Agama)
          </span>
        </button>
      </div>

      {/* Day Filter Pills */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedDay('all')}
          className={`btn btn-sm ${selectedDay === 'all' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 700 }}
        >
          Semua Hari (Senin - Jumat)
        </button>
        {days.map(d => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            className={`btn btn-sm ${selectedDay === d.key ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '9999px', padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 600 }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Schedule Lists by Day */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {days
          .filter(d => selectedDay === 'all' || selectedDay === d.key)
          .map(d => {
            const daySchedule = currentBlokData.schedule[d.key] || [];
            const kokuActivity = scheduleData.kokurikuler[d.key];

            return (
              <div key={d.key} className="card" style={{
                borderRadius: '16px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {/* Day Header Banner */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '12px',
                      height: '24px',
                      borderRadius: '4px',
                      backgroundColor: d.color
                    }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', color: 'var(--text-main)' }}>
                      HARI {d.label}
                    </h3>
                    <span className="badge" style={{
                      background: activeBlok === 'blok1' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: activeBlok === 'blok1' ? '#2563eb' : '#10b981',
                      border: '1px solid currentColor'
                    }}>
                      {activeBlok === 'blok1' ? 'Ruang: L.SIJA' : 'Ruang: RT-18'}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {daySchedule.filter(s => !s.isBreak).length} Sesi Pembelajaran
                  </span>
                </div>

                {/* Kokurikuler / Pembiasaan Karakter Notification */}
                {kokuActivity && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: '10px',
                    color: '#b45309',
                    fontSize: '0.82rem',
                    marginBottom: '1rem',
                    fontWeight: 600
                  }}>
                    <HeartHandshake size={18} style={{ flexShrink: 0, color: '#f59e0b' }} />
                    <div>
                      <strong>Pembiasaan Karakter & Kokurikuler: </strong>
                      <span>{activeBlok === 'blok1' ? kokuActivity.kejuruan : kokuActivity.umum}</span>
                    </div>
                  </div>
                )}

                {/* Table / Timeline of Periods */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-main)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem 1rem', width: '90px', color: 'var(--text-muted)' }}>Jam Ke</th>
                        <th style={{ padding: '0.75rem 1rem', width: '150px', color: 'var(--text-muted)' }}>Waktu</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Mata Pelajaran</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Nama Guru Pengajar</th>
                        <th style={{ padding: '0.75rem 1rem', width: '110px', color: 'var(--text-muted)' }}>Ruang</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daySchedule.map((slot, sIdx) => {
                        if (slot.isBreak) {
                          return (
                            <tr key={sIdx} style={{
                              background: 'rgba(245, 158, 11, 0.06)',
                              borderBottom: '1px solid var(--border)'
                            }}>
                              <td colSpan={5} style={{
                                padding: '0.65rem 1rem',
                                textAlign: 'center',
                                color: '#b45309',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                letterSpacing: '0.04em'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                  <Coffee size={15} />
                                  <span>{slot.subject} ({slot.time})</span>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        const isCharacter = slot.subject.includes('PEMBIASAAN');

                        return (
                          <tr
                            key={sIdx}
                            style={{
                              borderBottom: '1px solid var(--border)',
                              background: isCharacter ? 'rgba(59, 130, 246, 0.04)' : 'transparent',
                              transition: 'background-color 0.15s ease'
                            }}
                          >
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>
                              {slot.period}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Clock size={14} />
                                <span>{slot.time}</span>
                              </div>
                            </td>
                            <td style={{ padding: '0.75rem 1rem', fontWeight: isCharacter ? 600 : 700, color: 'var(--text-main)' }}>
                              {slot.subject}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: slot.teacher === '-' ? 'var(--text-muted)' : 'var(--text-main)' }}>
                              {slot.teacher !== '-' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                  <User size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                  <span style={{ fontWeight: 600 }}>{slot.teacher}</span>
                                </div>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: slot.room === 'L.SIJA' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                color: slot.room === 'L.SIJA' ? '#2563eb' : 'var(--text-muted)'
                              }}>
                                <MapPin size={12} />
                                {slot.room}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
      </div>

      {/* Kokurikuler Pancawaluya Full Reference Table */}
      <div className="card" style={{
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={18} style={{ color: '#f59e0b' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Pembiasaan Karakter Pancawaluya & Dimensi Profil Lulusan
          </h4>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-main)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem 0.85rem', width: '100px', color: 'var(--text-muted)' }}>Hari</th>
                <th style={{ padding: '0.65rem 0.85rem', width: '130px', color: 'var(--text-muted)' }}>Blok Pembelajaran</th>
                <th style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>Kegiatan Kokurikuler & Pembiasaan</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td rowSpan={2} style={{ padding: '0.65rem 0.85rem', fontWeight: 700, verticalAlign: 'top' }}>Senin</td>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>M. Umum (Blok 2)</td>
                <td style={{ padding: '0.65rem 0.85rem' }}>Upacara Bendera / Apel Pagi / Visit Class</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>M. Kejuruan (Blok 1)</td>
                <td style={{ padding: '0.65rem 0.85rem' }}>Literasi Numerasi / Pend. Anti Korupsi</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Selasa</td>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>M. Umum & Kejuruan</td>
                <td style={{ padding: '0.65rem 0.85rem' }}>10 Menit Awal: Sarapan Bareng dengan Bekal dari Rumah</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td rowSpan={2} style={{ padding: '0.65rem 0.85rem', fontWeight: 700, verticalAlign: 'top' }}>Rabu</td>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>M. Umum (Blok 2)</td>
                <td style={{ padding: '0.65rem 0.85rem' }}>Salat Dhuha Bersama bagi Murid Muslim dan Kajian Keagamaan sesuai Agama yang Dianut bagi Nonmuslim</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>M. Kejuruan (Blok 1)</td>
                <td style={{ padding: '0.65rem 0.85rem' }}>Budaya Kerja Industri</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Kamis</td>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>M. Umum & Kejuruan</td>
                <td style={{ padding: '0.65rem 0.85rem' }}>10 Menit Awal: Literasi Al-Qur'an (Muslim) dan Literasi Kitab Suci sesuai Agama dan Kepercayaan yang Dianut (Nonmuslim)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>Jumat</td>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>M. Umum & Kejuruan</td>
                <td style={{ padding: '0.65rem 0.85rem' }}>Jumsih (Jumat Bersih), Salat Dhuha, atau Senam Pagi yang dilaksanakan secara bergantian setiap minggu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
