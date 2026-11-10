import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  Phone,
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  School,
  Sparkles,
  Info,
  MapPin,
  Save
} from 'lucide-react';
import { apiService } from '../services/apiService';

export default function UserProfileModule({ currentUser, onUserUpdated }) {
  const [formData, setFormData] = useState({
    email: currentUser.email || '',
    phone: currentUser.phone || '081234567890',
    avatar: currentUser.avatar || '',
    bio: currentUser.bio || 'Peserta didik aktif SMKN 1 Cibinong Tahun Ajaran 2025/2026.',
    address: currentUser.address || 'Cibinong, Kabupaten Bogor, Jawa Barat'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preset avatar options for quick selection
  const avatarPresets = [
    { label: "Siswa 1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" },
    { label: "Siswa 2", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80" },
    { label: "Siswa 3", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80" },
    { label: "Guru Pria", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80" },
    { label: "Guru Wanita", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80" },
    { label: "Admin/Staf", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const { updatedUser, allUsers } = apiService.updateCurrentUserProfile(formData);
    if (onUserUpdated) {
      onUserUpdated(updatedUser, allUsers);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Title */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={24} style={{ color: 'var(--primary)' }} />
          Profil Saya & Pengaturan Akun
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Kelola informasi kontak, foto profil, dan preferensi akun Anda di e-Learning SMKN 1 Cibinong.
        </p>
      </div>

      {/* Security Alert Banner on Name & NISN lock */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(217,119,6,0.08) 100%)',
        border: '1px solid rgba(37,99,235,0.25)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <Lock size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
          <strong style={{ color: 'var(--text-main)' }}>Kebijakan Integritas Data Akademik:</strong>
          <span style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
            Data <strong>Nama Lengkap</strong> dan <strong>NISN / NIP</strong> tidak dapat diubah secara mandiri oleh pengguna demi menjaga sinkronisasi resmi data Dapodik Kemendikbud. Apabila terdapat kekeliruan ejaan nama atau nomor identitas, silakan menghubungi <strong>Administrator / Tim Kurikulum</strong> SMKN 1 Cibinong.
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div style={{
          background: 'var(--success-light)',
          border: '1px solid var(--success)',
          color: '#047857',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={20} />
          <span>Profil berhasil diperbarui dan tersimpan ke sistem e-Learning!</span>
        </div>
      )}

      {/* Main Grid: Preview & Edit Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Left Column: Profile Card Preview */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <img
              src={formData.avatar || currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--primary-light)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'var(--success)',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }} title="Akun Terverifikasi">
              <ShieldCheck size={14} />
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {currentUser.name}
          </h3>
          <span className={`badge ${currentUser.role === 'siswa' ? 'badge-primary' : currentUser.role === 'guru' ? 'badge-warning' : 'badge-danger'}`} style={{ marginTop: '0.35rem', marginBottom: '0.75rem' }}>
            {currentUser.role.toUpperCase()}
          </span>

          <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>
                {currentUser.role === 'siswa' ? 'NISN RESMI' : 'NIP / NUPTK'}
              </span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                {currentUser.identityNo}
              </span>
            </div>

            {currentUser.classRoom && (
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>KELAS</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentUser.classRoom}</span>
              </div>
            )}

            {currentUser.major && (
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>KOMPETENSI KEAHLIAN</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentUser.major}</span>
              </div>
            )}

            {currentUser.subject && (
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>MATA PELAJARAN</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{currentUser.subject}</span>
              </div>
            )}

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>INSTITUSI SEKOLAH</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>SMKN 1 Cibinong</span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Formulir Pembaruan Data Profil
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* LOCKED FIELDS SECTION */}
            <div style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Lock size={14} style={{ color: 'var(--warning)' }} /> Data Terproteksi (Tidak Dapat Diubah Mandiri)
              </div>

              {/* Locked Name */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Nama Lengkap:</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    🔒 Dikunci Sistem
                  </span>
                </label>
                <input
                  type="text"
                  value={currentUser.name}
                  disabled
                  className="form-input"
                  style={{
                    background: 'rgba(0,0,0,0.04)',
                    cursor: 'not-allowed',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}
                />
              </div>

              {/* Locked NISN / NIP */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{currentUser.role === 'siswa' ? 'NISN (Nomor Induk Siswa Nasional):' : 'NIP / NUPTK:'}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    🔒 Dikunci Sistem
                  </span>
                </label>
                <input
                  type="text"
                  value={currentUser.identityNo}
                  disabled
                  className="form-input"
                  style={{
                    background: 'rgba(0,0,0,0.04)',
                    cursor: 'not-allowed',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}
                />
              </div>
            </div>

            {/* EDITABLE FIELDS SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Alamat Email:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Nomor WhatsApp / HP:
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>

            {/* Avatar URL & Quick Presets */}
            <div className="form-group">
              <label className="form-label">
                <Camera size={14} style={{ display: 'inline', marginRight: '4px' }} />
                URL Foto Profil (Avatar):
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="form-input"
                placeholder="https://..."
              />
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Atau pilih avatar cepat:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {avatarPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: preset.url })}
                      className="btn btn-outline btn-sm"
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        borderColor: formData.avatar === preset.url ? 'var(--primary)' : 'var(--border)',
                        background: formData.avatar === preset.url ? 'var(--primary-light)' : 'transparent'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Alamat Domisili:
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="form-input"
                placeholder="Alamat tempat tinggal siswa..."
              />
            </div>

            {/* Bio / Catatan */}
            <div className="form-group">
              <label className="form-label">Bio Singkat / Catatan Diri:</label>
              <textarea
                rows="3"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="form-textarea"
                placeholder="Tuliskan bio atau minat pembelajaran Anda..."
              />
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                <Save size={18} /> Simpan Perubahan Profil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
