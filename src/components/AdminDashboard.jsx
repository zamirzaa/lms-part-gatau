import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Megaphone,
  School,
  CheckCircle2,
  ShieldAlert,
  Search,
  Plus,
  Edit3,
  ShieldCheck
} from 'lucide-react';
import { apiService } from '../services/apiService';
import RealtimeClockWidget from './RealtimeClockWidget';
import RealtimeActivityFeed from './RealtimeActivityFeed';

export default function AdminDashboard({ currentUser, users, setUsers, announcements, setAnnouncements }) {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddAnnModal, setShowAddAnnModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserForm, setEditUserForm] = useState(null);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    role: 'siswa',
    name: '',
    identityNo: '',
    classRoom: 'XII RPL 1',
    major: 'Rekayasa Perangkat Lunak',
    email: ''
  });

  // New Announcement Form State
  const [newAnnForm, setNewAnnForm] = useState({
    title: '',
    category: 'Penting',
    content: ''
  });

  const handleOpenEditUser = (user) => {
    setEditUserForm({
      id: user.id,
      name: user.name || '',
      identityNo: user.identityNo || '',
      role: user.role || 'siswa',
      classRoom: user.classRoom || 'XII RPL 1',
      major: user.major || 'Rekayasa Perangkat Lunak',
      subject: user.subject || 'Pemrograman Web',
      email: user.email || '',
      phone: user.phone || '081234567890',
      avatar: user.avatar || ''
    });
    setShowEditUserModal(true);
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editUserForm) return;

    const updatedUser = {
      ...editUserForm,
      classRoom: editUserForm.role === 'siswa' ? editUserForm.classRoom : undefined,
      subject: editUserForm.role === 'guru' ? editUserForm.subject : undefined
    };

    const updated = apiService.updateUser(updatedUser);
    setUsers(updated);
    setShowEditUserModal(false);
    alert(`Data pengguna "${updatedUser.name}" (NISN/NIP: ${updatedUser.identityNo}) berhasil diperbarui oleh Administrator!`);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const createdUser = {
      id: `usr-${Date.now()}`,
      username: newUserForm.name.toLowerCase().replace(/\s+/g, '.'),
      role: newUserForm.role,
      name: newUserForm.name,
      identityNo: newUserForm.identityNo,
      classRoom: newUserForm.role === 'siswa' ? newUserForm.classRoom : undefined,
      major: newUserForm.major,
      subject: newUserForm.role === 'guru' ? 'Pemrograman Web' : undefined,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
      email: newUserForm.email || `${newUserForm.name.toLowerCase().replace(/\s+/g, '.')}@smkn1cibinong.sch.id`
    };

    const updated = apiService.addUser(createdUser);
    setUsers(updated);
    setShowAddUserModal(false);
    setNewUserForm({ role: 'siswa', name: '', identityNo: '', classRoom: 'XII RPL 1', major: 'Rekayasa Perangkat Lunak', email: '' });
    alert(`Pengguna ${createdUser.name} berhasil ditambahkan!`);
  };

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna ${userName}?`)) {
      const updated = apiService.deleteUser(userId);
      setUsers(updated);
    }
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    const created = {
      id: `ann-${Date.now()}`,
      title: newAnnForm.title,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: currentUser.name,
      category: newAnnForm.category,
      content: newAnnForm.content
    };

    const updated = apiService.addAnnouncement(created);
    setAnnouncements(updated);
    setShowAddAnnModal(false);
    setNewAnnForm({ title: '', category: 'Penting', content: '' });
    alert("Pengumuman sekolah berhasil dipublikasikan!");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Realtime Clock Bar */}
      <RealtimeClockWidget />

      {/* Admin Hero Banner */}
      <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #991b1b 100%)' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <img src="/logo-smkn1.png" alt="Logo SMKN 1 Cibinong" style={{ height: "22px", width: "auto" }} /> <span>Portal Administrator & Kurikulum SMKN 1 Cibinong</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Selamat Datang, {currentUser.name}
          </h2>
          <p style={{ opacity: 0.9, maxWidth: '650px', fontSize: '0.95rem' }}>
            Akses Penuh Manajemen Pengguna, Kelas, Ujian CBT, dan Broadcast Pengumuman Sekolah.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={() => setShowAddUserModal(true)} className="btn btn-accent">
              <UserPlus size={16} /> Tambah Akun Pengguna
            </button>
            <button onClick={() => setShowAddAnnModal(true)} className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
              <Megaphone size={16} /> Broadcast Pengumuman
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Pengguna Active</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>{users.length}</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Users size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Siswa, Guru & Staf SMKN 1 Cibinong
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tingkat Kehadiran</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>98.4%</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 600 }}>
            Status: Sangat Tertib
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Jurusan Kejuruan</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>7 Jurusan</h3>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
              <School size={22} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            RPL, TKJ, DKV, TP, TKR, TBO, TEI
          </p>
        </div>
      </div>

      {/* User Management Table & Realtime Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                👥 Kelola Data Pengguna (CRUD)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Daftar akun Siswa, Guru, dan Admin terdaftar di LMS SMKN 1 Cibinong.
              </p>
            </div>
            <button onClick={() => setShowAddUserModal(true)} className="btn btn-primary">
              <Plus size={16} /> Tambah User
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Profil</th>
                <th>Role</th>
                <th>NISN / NIP</th>
                <th>Kelas / Pengampu</th>
                <th>Jurusan</th>
                <th>Email</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                    <img src={u.avatar} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    {u.name}
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'siswa' ? 'badge-primary' : u.role === 'guru' ? 'badge-warning' : 'badge-danger'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{u.identityNo}</td>
                  <td style={{ fontSize: '0.85rem' }}>{u.classRoom || u.subject || '-'}</td>
                  <td style={{ fontSize: '0.85rem' }}>{u.major || 'Umum'}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        onClick={() => handleOpenEditUser(u)}
                        className="btn btn-secondary btn-sm"
                        title="Edit User (Ubah Nama & NISN/NIP)"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="btn btn-danger btn-sm"
                          title="Hapus User"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Realtime Activity Feed Stream */}
        <RealtimeActivityFeed />
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
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
          <div className="glass-card" style={{ width: '480px', padding: '1.5rem', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Tambah Pengguna Baru
            </h3>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Role Pengguna:</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="form-select"
                >
                  <option value="siswa">Siswa</option>
                  <option value="guru">Guru / Pengajar</option>
                  <option value="admin">Admin / Kurikulum</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nama Lengkap:</label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Fikri, S.Kom."
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{newUserForm.role === 'siswa' ? 'NISN:' : 'NIP / NUPTK:'}</label>
                <input
                  type="text"
                  placeholder={newUserForm.role === 'siswa' ? '0061234599' : '198912312015011001'}
                  value={newUserForm.identityNo}
                  onChange={(e) => setNewUserForm({ ...newUserForm, identityNo: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              {newUserForm.role === 'siswa' && (
                <div className="form-group">
                  <label className="form-label">Kelas:</label>
                  <input
                    type="text"
                    placeholder="XII SIJA"
                    value={newUserForm.classRoom}
                    onChange={(e) => setNewUserForm({ ...newUserForm, classRoom: e.target.value })}
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Jurusan:</label>
                <select
                  value={newUserForm.major}
                  onChange={(e) => setNewUserForm({ ...newUserForm, major: e.target.value })}
                  className="form-select"
                >
                  <option value="Sistem Informatika, Jaringan & Aplikasi (SIJA)">Sistem Informatika, Jaringan & Aplikasi (SIJA)</option>`n                  <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak (RPL)</option>
                  <option value="Teknik Komputer & Jaringan">Teknik Komputer & Jaringan (TKJ)</option>
                  <option value="Desain Komunikasi Visual">Desain Komunikasi Visual (DKV)</option>
                  <option value="Teknik Pemesinan">Teknik Pemesinan (TP)</option>
                  <option value="Teknik Kendaraan Ringan">Teknik Kendaraan Ringan (TKR)</option>
                  <option value="Teknik Elektronika Industri">Teknik Elektronika Industri (TEI)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showAddAnnModal && (
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
          <div className="glass-card" style={{ width: '480px', padding: '1.5rem', background: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Broadcast Pengumuman Sekolah
            </h3>
            <form onSubmit={handleAddAnnouncement}>
              <div className="form-group">
                <label className="form-label">Judul Pengumuman:</label>
                <input
                  type="text"
                  placeholder="Contoh: Pengumuman PTS Ganjil"
                  value={newAnnForm.title}
                  onChange={(e) => setNewAnnForm({ ...newAnnForm, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kategori:</label>
                <select
                  value={newAnnForm.category}
                  onChange={(e) => setNewAnnForm({ ...newAnnForm, category: e.target.value })}
                  className="form-select"
                >
                  <option value="Penting">Penting</option>
                  <option value="Informasi">Informasi</option>
                  <option value="Kegiatan">Kegiatan Sekolah</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Isi Pengumuman:</label>
                <textarea
                  rows="4"
                  placeholder="Tuliskan isi pengumuman sekolah di sini..."
                  value={newAnnForm.content}
                  onChange={(e) => setNewAnnForm({ ...newAnnForm, content: e.target.value })}
                  className="form-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddAnnModal(false)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-accent">
                  Publikasikan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal (Admin Authority: Can change Name & NISN/NIP) */}
      {showEditUserModal && editUserForm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ width: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Edit3 size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  Edit Data Pengguna
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                  🛡️ Wewenang Penuh Administrator (Ubah Nama & NISN)
                </span>
              </div>
            </div>

            <div style={{
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              fontSize: '0.78rem',
              color: 'var(--text-main)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <ShieldCheck size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>Sebagai Administrator Kurikulum, Anda memiliki wewenang resmi untuk memperbarui ejaan <strong>Nama</strong> dan <strong>NISN / NIP</strong>.</span>
            </div>

            <form onSubmit={handleSaveEditUser}>
              {/* EDITABLE NAME FOR ADMIN */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  Nama Lengkap (Wewenang Admin):
                </label>
                <input
                  type="text"
                  value={editUserForm.name}
                  onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                  className="form-input"
                  style={{ border: '1.5px solid var(--primary)', fontWeight: 600 }}
                  required
                />
              </div>

              {/* EDITABLE NISN / NIP FOR ADMIN */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {editUserForm.role === 'siswa' ? 'NISN (Nomor Induk Siswa Nasional):' : 'NIP / NUPTK:'}
                </label>
                <input
                  type="text"
                  value={editUserForm.identityNo}
                  onChange={(e) => setEditUserForm({ ...editUserForm, identityNo: e.target.value })}
                  className="form-input"
                  style={{ border: '1.5px solid var(--primary)', fontWeight: 600 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Role Pengguna:</label>
                  <select
                    value={editUserForm.role}
                    onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                    className="form-select"
                  >
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru / Pengajar</option>
                    <option value="admin">Admin / Kurikulum</option>
                  </select>
                </div>

                {editUserForm.role === 'siswa' ? (
                  <div className="form-group">
                    <label className="form-label">Kelas:</label>
                    <input
                      type="text"
                      value={editUserForm.classRoom}
                      onChange={(e) => setEditUserForm({ ...editUserForm, classRoom: e.target.value })}
                      className="form-input"
                      placeholder="Contoh: XII RPL 1"
                    />
                  </div>
                ) : editUserForm.role === 'guru' ? (
                  <div className="form-group">
                    <label className="form-label">Mata Pelajaran:</label>
                    <input
                      type="text"
                      value={editUserForm.subject}
                      onChange={(e) => setEditUserForm({ ...editUserForm, subject: e.target.value })}
                      className="form-input"
                      placeholder="Contoh: Pemrograman Web"
                    />
                  </div>
                ) : null}
              </div>

              <div className="form-group">
                <label className="form-label">Jurusan / Kompetensi Keahlian:</label>
                <select
                  value={editUserForm.major}
                  onChange={(e) => setEditUserForm({ ...editUserForm, major: e.target.value })}
                  className="form-select"
                >
                  <option value="Sistem Informatika, Jaringan & Aplikasi (SIJA)">Sistem Informatika, Jaringan & Aplikasi (SIJA)</option>`n                  <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak (RPL)</option>
                  <option value="Teknik Komputer & Jaringan">Teknik Komputer & Jaringan (TKJ)</option>
                  <option value="Desain Komunikasi Visual">Desain Komunikasi Visual (DKV)</option>
                  <option value="Teknik Pemesinan">Teknik Pemesinan (TP)</option>
                  <option value="Teknik Kendaraan Ringan">Teknik Kendaraan Ringan (TKR)</option>
                  <option value="Teknik Elektronika Industri">Teknik Elektronika Industri (TEI)</option>
                  <option value="Umum">Umum / Semua Jurusan</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Alamat Email:</label>
                  <input
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor Telepon:</label>
                  <input
                    type="text"
                    value={editUserForm.phone}
                    onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">URL Foto Profil (Avatar):</label>
                <input
                  type="url"
                  value={editUserForm.avatar}
                  onChange={(e) => setEditUserForm({ ...editUserForm, avatar: e.target.value })}
                  className="form-input"
                  placeholder="https://..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowEditUserModal(false)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Perubahan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
