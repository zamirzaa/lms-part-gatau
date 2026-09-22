import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  MapPin,
  Camera,
  Search
} from 'lucide-react';
import { apiService } from '../services/apiService';

export default function AttendanceModule({ currentUser, attendance, setAttendance }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const myTodayAtt = attendance.find(a => a.studentId === currentUser.id && a.date === todayStr);

  const [statusSelect, setStatusSelect] = useState('Hadir');
  const [notesInput, setNotesInput] = useState('');

  const handleRecordAttendance = (e) => {
    e.preventDefault();
    const record = {
      id: `att-${Date.now()}`,
      date: todayStr,
      studentId: currentUser.id,
      studentName: currentUser.name,
      classRoom: currentUser.classRoom || 'XII RPL 1',
      status: statusSelect,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      notes: notesInput || 'Presensi digital mandiri'
    };

    const updated = apiService.recordAttendance(record);
    setAttendance(updated);
    alert(`Presensi status '${statusSelect}' berhasil dicatat!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
          📅 Presensi & Kehadiran Online
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Sistem Rekapitulasi Presensi Kehadiran Digital SMKN 1 Cibinong.
        </p>
      </div>

      {/* Student Self Check-in Banner */}
      {currentUser.role === 'siswa' && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(16,185,129,0.06) 100%)', border: '1.5px solid var(--primary-hover)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarCheck size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  HARI INI: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                  Form Presensi Kehadiran Siswa
                </h3>
              </div>
            </div>

            {myTodayAtt ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success-light)', padding: '0.6rem 1.2rem', borderRadius: '12px', color: '#047857', fontWeight: 700 }}>
                <CheckCircle2 size={20} />
                <span>Anda Sudah Presensi: {myTodayAtt.status} ({myTodayAtt.time})</span>
              </div>
            ) : (
              <form onSubmit={handleRecordAttendance} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <select
                  value={statusSelect}
                  onChange={(e) => setStatusSelect(e.target.value)}
                  className="form-select"
                  style={{ width: '130px' }}
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Izin">Izin</option>
                  <option value="Sakit">Sakit</option>
                </select>

                <input
                  type="text"
                  placeholder="Keterangan / Catatan..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="form-input"
                  style={{ width: '200px' }}
                />

                <button type="submit" className="btn btn-primary">
                  Kirim Absen
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Attendance History Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
          📋 Rekapitulasi Presensi Kehadiran Kelas
        </h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>Status Kehadiran</th>
              <th>Jam Absen</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(att => (
              <tr key={att.id}>
                <td style={{ fontWeight: 600 }}>{att.date}</td>
                <td style={{ fontWeight: 700 }}>{att.studentName}</td>
                <td>{att.classRoom}</td>
                <td>
                  <span className={`badge ${att.status === 'Hadir' ? 'badge-success' : att.status === 'Izin' ? 'badge-warning' : 'badge-danger'}`}>
                    {att.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{att.time}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{att.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
