import React from 'react';
import {
  Printer,
  Award,
  BookOpen,
  CheckCircle2,
  School,
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_SCHOOL_INFO } from '../services/mockData';

export default function GradesReportModule({ currentUser }) {
  const gradesList = [
    { code: 'RPL-301', subject: 'Pemrograman Web & Bergerak', kkm: 75, score: 95, grade: 'A', status: 'Tuntas' },
    { code: 'RPL-302', subject: 'Basis Data & Cloud Architecture', kkm: 75, score: 92, grade: 'A', status: 'Tuntas' },
    { code: 'TKJ-301', subject: 'Administrasi Infrastruktur Jaringan', kkm: 75, score: 88, grade: 'B+', status: 'Tuntas' },
    { code: 'UMM-101', subject: 'Matematika Kejuruan', kkm: 75, score: 90, grade: 'A', status: 'Tuntas' },
    { code: 'UMM-102', subject: 'Bahasa Indonesia', kkm: 75, score: 89, grade: 'A', status: 'Tuntas' },
    { code: 'UMM-103', subject: 'Bahasa Inggris Kejuruan', kkm: 75, score: 94, grade: 'A', status: 'Tuntas' }
  ];

  const totalScore = gradesList.reduce((acc, curr) => acc + curr.score, 0);
  const avgScore = (totalScore / gradesList.length).toFixed(1);

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
            Laporan Hasil Belajar Siswa SMKN 1 Cibinong Semester Ganjil 2025/2026.
          </p>
        </div>

        <button onClick={handlePrint} className="btn btn-primary">
          <Printer size={16} /> Cetak / Export Rapor (PDF)
        </button>
      </div>

      {/* Official Printable Rapor Card */}
      <div className="card rapor-container" style={{ padding: '2.5rem', background: 'white', color: '#0f172a', border: '1px solid var(--border)' }}>
        {/* Kop Surat Sekolah */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px double #0f172a',
          paddingBottom: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '55px', height: '55px', borderRadius: '12px',
              background: '#1e3a8a', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900
            }}>
              <School size={36} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#1e3a8a' }}>
                PEMERINTAH PROVINSI JAWA BARAT
              </h3>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                DINAS PENDIDIKAN - SMKN 1 CIBINONG
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#475569' }}>
                {INITIAL_SCHOOL_INFO.address} • NPSN: {INITIAL_SCHOOL_INFO.npsn}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569' }}>
            <strong>AKREDITASI A</strong><br />
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
            <p>Nama Peserta Didik: <strong>{currentUser.name}</strong></p>
            <p>NISN / NIS: <strong>{currentUser.identityNo}</strong></p>
            <p>Kelas / Jurusan: <strong>{currentUser.classRoom || 'XII RPL 1'} • {currentUser.major || 'RPL'}</strong></p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p>Tahun Pelajaran: <strong>2025/2026</strong></p>
            <p>Semester: <strong>Ganjil (1)</strong></p>
            <p>Peringkat Kelas: <strong>2 Dari 36 Siswa</strong></p>
          </div>
        </div>

        {/* Grades Table */}
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1e3a8a' }}>
          CAPAIAN HASIL BELAJAR (NILAI AKHIR MAPEL)
        </h4>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#1e3a8a', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1' }}>No</th>
              <th style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1' }}>Kode Mapel</th>
              <th style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1' }}>Mata Pelajaran Kejuruan</th>
              <th style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>KKM</th>
              <th style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>Nilai Akhir</th>
              <th style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>Predikat</th>
              <th style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {gradesList.map((g, idx) => (
              <tr key={g.code} style={{ background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', fontWeight: 600 }}>{idx + 1}</td>
                <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1' }}>{g.code}</td>
                <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', fontWeight: 700 }}>{g.subject}</td>
                <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{g.kkm}</td>
                <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, color: '#1e3a8a' }}>{g.score}</td>
                <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}>{g.grade}</td>
                <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center', color: '#047857', fontWeight: 700 }}>{g.status}</td>
              </tr>
            ))}
            <tr style={{ background: '#eff6ff', fontWeight: 800 }}>
              <td colSpan="4" style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'right' }}>RATA-RATA NILAI KESELURUHAN:</td>
              <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center', fontSize: '1.05rem', color: '#1e3a8a' }}>{avgScore}</td>
              <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>A (Sangat Baik)</td>
              <td style={{ padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', textAlign: 'center', color: '#047857' }}>LULUS</td>
            </tr>
          </tbody>
        </table>

        {/* Signatures Footer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem', fontSize: '0.85rem', textAlign: 'center' }}>
          <div>
            <p>Orang Tua / Wali Siswa,</p>
            <div style={{ height: '70px' }}></div>
            <p style={{ textDecoration: 'underline', fontWeight: 700 }}>( .................................................... )</p>
          </div>
          <div>
            <p>Cibinong, 22 September 2026<br />Wali Kelas XII RPL 1,</p>
            <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#047857', border: '1px dashed #047857', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                [ E-Signed Official SMKN 1 Cibinong ]
              </span>
            </div>
            <p style={{ textDecoration: 'underline', fontWeight: 700 }}>Budi Santoso, S.Kom., M.T.</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>NIP. 198504122010011002</p>
          </div>
        </div>
      </div>
    </div>
  );
}
