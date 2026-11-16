import React from 'react';
import {
  Printer,
  Award,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  GraduationCap
} from 'lucide-react';
import { INITIAL_SCHOOL_INFO } from '../services/mockData';

export default function GradesReportModule({ currentUser }) {
  // 15 Mata Pelajaran Resmi Sesuai Blok 1 & Blok 2 Kelas XII SIJA 2
  const gradesListBlok1 = [
    { code: 'SIJA-301', subject: 'SIJA : System Administration', teacher: 'Danu Winardi, ST', kkm: 75, score: 92, grade: 'A', status: 'Tuntas' },
    { code: 'SIJA-302', subject: 'MPP SIJA : FTTx', teacher: 'Arya Prawirandika, S.Kom', kkm: 75, score: 90, grade: 'A', status: 'Tuntas' },
    { code: 'SIJA-303', subject: 'SIJA : Network Engineering', teacher: 'Arya Prawirandika, S.Kom', kkm: 75, score: 95, grade: 'A', status: 'Tuntas' },
    { code: 'SIJA-304', subject: 'SIJA : Mobile Development', teacher: 'Denianto Bonis Nugroho, S.Kom', kkm: 75, score: 88, grade: 'B+', status: 'Tuntas' },
    { code: 'SIJA-305', subject: 'SIJA : Development & Operation (DevOps)', teacher: 'Dayu Destamy Ariefin, S.Pd', kkm: 75, score: 91, grade: 'A', status: 'Tuntas' },
    { code: 'SIJA-306', subject: 'SIJA : CCNA', teacher: 'Subari Chairulloh, S.Kom', kkm: 75, score: 94, grade: 'A', status: 'Tuntas' },
    { code: 'UMM-201', subject: 'Pend. Jasmani Olahraga dan Kesehatan', teacher: 'Rinaldi Maulana, S.Pd', kkm: 75, score: 89, grade: 'A', status: 'Tuntas' }
  ];

  const gradesListBlok2 = [
    { code: 'PKK-301', subject: 'Kreativitas, Inovasi dan Kewirausahaan', teacher: 'Subari Chairulloh, S.Kom', kkm: 75, score: 93, grade: 'A', status: 'Tuntas' },
    { code: 'UMM-103', subject: 'Bahasa Inggris', teacher: 'Dedi Supriyadi, S.Pd', kkm: 75, score: 92, grade: 'A', status: 'Tuntas' },
    { code: 'UMM-102', subject: 'Bahasa Indonesia', teacher: 'Anne Nurasiah, S.Pd', kkm: 75, score: 89, grade: 'A', status: 'Tuntas' },
    { code: 'UMM-101', subject: 'Matematika', teacher: 'Ade Hermanto Sudrajat, S.Si', kkm: 75, score: 90, grade: 'A', status: 'Tuntas' },
    { code: 'UMM-104', subject: 'Pend. Pancasila', teacher: 'Sri Purwaningsih, S.Pd', kkm: 75, score: 94, grade: 'A', status: 'Tuntas' },
    { code: 'UMM-105', subject: 'Sejarah', teacher: 'Wira Wiharja, S.Pd', kkm: 75, score: 88, grade: 'B+', status: 'Tuntas' },
    { code: 'MULOK-101', subject: 'Bahasa Jepang', teacher: 'Novi Karisma, S.Pd', kkm: 75, score: 91, grade: 'A', status: 'Tuntas' },
    { code: 'UMM-100', subject: 'Pendidikan Agama dan Budi Pekerti', teacher: 'Darjatul Aliyah, SS', kkm: 75, score: 96, grade: 'A', status: 'Tuntas' }
  ];

  const allGrades = [...gradesListBlok1, ...gradesListBlok2];
  const totalScore = allGrades.reduce((acc, curr) => acc + curr.score, 0);
  const avgScore = (totalScore / allGrades.length).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header controls */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            📊 Transkrip Nilai & Rapor Digital
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Laporan Hasil Belajar Resmi Kelas XII SIJA 2 Semester Ganjil 2026/2027 (15 Mata Pelajaran Blok 1 & Blok 2).
          </p>
        </div>

        <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Printer size={16} /> Cetak / Export Rapor (PDF)
        </button>
      </div>

      {/* Official Printable Rapor Card */}
      <div className="card rapor-container" style={{ padding: '2.5rem', background: 'white', color: '#0f172a', border: '1px solid var(--border)' }}>
        {/* Kop Surat Sekolah Resmi dengan Logo Asli SMKN 1 Cibinong */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px double #0f172a',
          paddingBottom: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src="/logo-smkn1.png"
              alt="Logo Resmi SMKN 1 Cibinong"
              style={{ width: '70px', height: '70px', objectFit: 'contain' }}
            />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#1e3a8a' }}>
                PEMERINTAH DAERAH PROVINSI JAWA BARAT
              </h3>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a' }}>
                DINAS PENDIDIKAN - SMKN 1 CIBINONG
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#475569' }}>
                {INITIAL_SCHOOL_INFO.address} • NPSN: {INITIAL_SCHOOL_INFO.npsn}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569' }}>
            <strong>AKREDITASI A (SANGAT BAIK)</strong><br />
            SMK PUSAT KEUNGGULAN (PK)<br />
            ISO 9001:2015 Verified
          </div>
        </div>

        {/* Student Biodata Box */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
          background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0',
          fontSize: '0.88rem', marginBottom: '1.5rem'
        }}>
          <div>
            <p style={{ margin: '0 0 0.35rem 0' }}>Nama Peserta Didik: <strong>{currentUser.name}</strong></p>
            <p style={{ margin: '0 0 0.35rem 0' }}>NISN / NIS: <strong>{currentUser.identityNo}</strong></p>
            <p style={{ margin: 0 }}>Kelas / Kompetensi: <strong>XII SIJA 2 • Sistem Informatika, Jaringan & Aplikasi</strong></p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 0.35rem 0' }}>Tahun Pelajaran: <strong>2026/2027</strong></p>
            <p style={{ margin: '0 0 0.35rem 0' }}>Semester: <strong>Ganjil (1)</strong></p>
            <p style={{ margin: 0 }}>Status Siswa: <strong style={{ color: '#047857' }}>Aktif (36 Siswa)</strong></p>
          </div>
        </div>

        {/* Grades Table: BLOK 1 */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <Layers size={17} style={{ color: '#1e3a8a' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#1e3a8a' }}>
              A. KELOMPOK MATA PELAJARAN KEJURUAN SIJA (BLOK 1 - LAB L.SIJA)
            </h4>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#1e3a8a', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '40px', textAlign: 'center' }}>No</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '90px' }}>Kode</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1' }}>Mata Pelajaran</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '220px' }}>Guru Pengajar</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '60px', textAlign: 'center' }}>KKM</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '70px', textAlign: 'center' }}>Nilai</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '70px', textAlign: 'center' }}>Predikat</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '90px', textAlign: 'center' }}>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {gradesListBlok1.map((g, idx) => (
                <tr key={g.code} style={{ background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', fontWeight: 600, color: '#475569' }}>{g.code}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', fontWeight: 700 }}>{g.subject}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', color: '#334155' }}>{g.teacher}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{g.kkm}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, color: '#1e3a8a' }}>{g.score}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}>{g.grade}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', textAlign: 'center', color: '#047857', fontWeight: 700 }}>{g.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grades Table: BLOK 2 */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <BookOpen size={17} style={{ color: '#1e3a8a' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#1e3a8a' }}>
              B. KELOMPOK MATA PELAJARAN UMUM & NORMATIF ADAPTIF (BLOK 2 - RUANG RT-18)
            </h4>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#1e3a8a', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '40px', textAlign: 'center' }}>No</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '90px' }}>Kode</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1' }}>Mata Pelajaran</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '220px' }}>Guru Pengajar</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '60px', textAlign: 'center' }}>KKM</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '70px', textAlign: 'center' }}>Nilai</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '70px', textAlign: 'center' }}>Predikat</th>
                <th style={{ padding: '0.6rem 0.75rem', border: '1px solid #cbd5e1', width: '90px', textAlign: 'center' }}>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {gradesListBlok2.map((g, idx) => (
                <tr key={g.code} style={{ background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', fontWeight: 600, color: '#475569' }}>{g.code}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', fontWeight: 700 }}>{g.subject}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', color: '#334155' }}>{g.teacher}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{g.kkm}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, color: '#1e3a8a' }}>{g.score}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}>{g.grade}</td>
                  <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', textAlign: 'center', color: '#047857', fontWeight: 700 }}>{g.status}</td>
                </tr>
              ))}
              <tr style={{ background: '#eff6ff', fontWeight: 800 }}>
                <td colSpan="5" style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'right' }}>
                  RATA-RATA NILAI AKHIR (15 MATA PELAJARAN):
                </td>
                <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center', fontSize: '1.05rem', color: '#1e3a8a' }}>
                  {avgScore}
                </td>
                <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>A</td>
                <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center', color: '#047857' }}>TUNTAS / LULUS</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures Footer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem 0' }}>Mengetahui,</p>
            <p style={{ margin: 0 }}>Orang Tua / Wali Siswa,</p>
            <div style={{ height: '65px' }}></div>
            <p style={{ textDecoration: 'underline', fontWeight: 700, margin: '0 0 0.2rem 0' }}>( .................................................... )</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0' }}>Cibinong, 16 November 2026</p>
            <p style={{ margin: 0 }}>Wali Kelas XII SIJA 2,</p>
            <div style={{ height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#047857', border: '1px dashed #047857', padding: '0.25rem 0.65rem', borderRadius: '4px', background: 'rgba(4, 120, 87, 0.05)' }}>
                ✓ E-Signed Official SMKN 1 Cibinong
              </span>
            </div>
            <p style={{ textDecoration: 'underline', fontWeight: 700, margin: '0 0 0.2rem 0' }}>Danu Winardi, ST</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>NIP. 198205122008011005</p>
          </div>
        </div>
      </div>
    </div>
  );
}
