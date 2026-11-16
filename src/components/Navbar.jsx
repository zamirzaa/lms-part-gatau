import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  ChevronDown,
  UserCheck,
  Search,
  LogOut,
  User,
  ShieldAlert
} from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function Navbar({
  currentUser,
  onLogout,
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const notifications = [
    { id: 1, text: "Ujian CBT Komputasi Awan (XII SIJA) telah dibuka", time: "5m yang lalu", unread: true },
    { id: 2, text: "Praktikum Setup Nginx telah dinilai oleh Pak Budi Santoso", time: "30m yang lalu", unread: true },
    { id: 3, text: "Pengumuman PTS Ganjil 2025/2026 telah dirilis", time: "1 hari yang lalu", unread: false }
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'siswa':
        return <span className="badge badge-primary">Siswa</span>;
      case 'guru':
        return <span className="badge badge-warning">Guru / Pengajar</span>;
      case 'admin':
        return <span className="badge badge-danger">Admin Kurikulum</span>;
      default:
        return null;
    }
  };

  if (!currentUser) return null;

  return (
    <header className="no-print" style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0.65rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand & Official Logo SMKN 1 Cibinong */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <img
          src="/logo-smkn1.png"
          alt="Logo Resmi SMKN 1 Cibinong"
          style={{
            height: '46px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))'
          }}
        />
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
            e-Learning <span style={{ color: '#2563eb' }}>SMKN 1 CIBINONG</span>
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            LMS Pusat Keunggulan • Kab. Bogor
          </p>
        </div>
      </div>

      {/* Quick Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '9999px',
        padding: '0.4rem 1rem',
        width: '320px',
        gap: '0.5rem'
      }}>
        <Search size={16} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Cari mapel, materi, atau tugas..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '0.85rem',
            width: '100%',
            color: 'var(--text-main)'
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Dark Mode Toggle */}
        <button
          className="btn btn-outline"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
          style={{ padding: '0.5rem', borderRadius: '50%' }}
        >
          {darkMode ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} />}
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-outline"
            onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
            style={{ padding: '0.5rem', borderRadius: '50%', position: 'relative' }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--danger)'
            }}></span>
          </button>

          {showNotificationDrawer && (
            <div className="glass-card" style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '320px',
              padding: '1rem',
              zIndex: 50
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Notifikasi Sekolah</h4>
                <span className="badge badge-primary">3 Baru</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    background: n.unread ? 'var(--primary-light)' : 'transparent',
                    border: '1px solid var(--border)',
                    fontSize: '0.8rem'
                  }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{n.text}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu (Clean, no switcher list) */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.85rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '9999px',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <UserAvatar user={currentUser} size={34} />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{currentUser.name.split(' ')[0]}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {currentUser.classRoom ? currentUser.classRoom : currentUser.role.toUpperCase()}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>

          {showUserMenu && (
            <div className="glass-card" style={{
              position: 'absolute',
              right: 0,
              top: '55px',
              width: '280px',
              padding: '1.25rem',
              zIndex: 60,
              boxShadow: '0 16px 36px -10px rgba(0,0,0,0.3)',
              borderRadius: '16px',
              border: '1px solid var(--border)'
            }}>
              {/* Profile Card Header */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border)'
              }}>
                <div style={{ marginBottom: '0.65rem' }}>
                  <UserAvatar user={currentUser} size={64} />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>
                  {currentUser.name}
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                  {currentUser.classRoom ? `${currentUser.classRoom} • ` : ''}
                  {currentUser.identityNo ? `NIS/NIP: ${currentUser.identityNo}` : `@${currentUser.username}`}
                </div>
                <div>{getRoleBadge(currentUser.role)}</div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    setShowUserMenu(false);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{
                    width: '100%',
                    fontSize: '0.82rem',
                    justifyContent: 'flex-start',
                    padding: '0.6rem 0.85rem',
                    gap: '0.6rem'
                  }}
                >
                  <UserCheck size={16} style={{ color: 'var(--primary)' }} />
                  <span>Buka / Edit Profil Saya</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onLogout) {
                      onLogout();
                    }
                  }}
                  className="btn btn-sm"
                  style={{
                    width: '100%',
                    fontSize: '0.82rem',
                    justifyContent: 'flex-start',
                    padding: '0.6rem 0.85rem',
                    gap: '0.6rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                >
                  <LogOut size={16} />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
