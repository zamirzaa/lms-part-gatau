import React, { useState } from 'react';
import {
  GraduationCap,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  UserCheck,
  LogOut,
  Sparkles,
  Search,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { INITIAL_USERS } from '../services/mockData';

export default function Navbar({ currentUser, onUserChange, darkMode, setDarkMode, activeTab, setActiveTab }) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const notifications = [
    { id: 1, text: "Ujian CBT 'UTS Pemrograman Web' aktif sampai jam 12:00 WIB", time: "10m yang lalu", unread: true },
    { id: 2, text: "Tugas 1 React JS telah dinilai oleh Pak Budi Santoso (Skor: 95)", time: "1j yang lalu", unread: true },
    { id: 3, text: "Pengumuman PTS Ganjil 2025/2026 telah dirilis", time: "1 hari yang lalu", unread: false }
  ];

  const handleRoleSelect = (user) => {
    apiService.setCurrentUser(user);
    onUserChange(user);
    setShowRoleMenu(false);
  };

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

  return (
    <header className="no-print" style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <GraduationCap size={26} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
            e-Learning <span style={{ color: '#2563eb' }}>SMKN 1 CIBINONG</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            LMS Pusat Keunggulan - Kab. Bogor
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
          placeholder="Cari mapel, tugas, atau ujian..."
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

        {/* Account & Role Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{currentUser.name.split(' ')[0]}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser.role.toUpperCase()}</div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>

          {showRoleMenu && (
            <div className="glass-card" style={{
              position: 'absolute',
              right: 0,
              top: '55px',
              width: '280px',
              padding: '1rem',
              zIndex: 60
            }}>
              <div style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Simulasi Ganti Role / Akun:
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  {currentUser.name}
                </div>
                <div style={{ marginTop: '0.25rem' }}>{getRoleBadge(currentUser.role)}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {INITIAL_USERS.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleRoleSelect(u)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: u.id === currentUser.id ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      background: u.id === currentUser.id ? 'var(--primary-light)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {u.role.toUpperCase()} {u.classRoom || u.subject ? `• ${u.classRoom || u.subject}` : ''}
                      </div>
                    </div>
                    {u.id === currentUser.id && <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />}
                  </button>
                ))}
              </div>

              <button
                onClick={() => apiService.resetToDefault()}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--danger)' }}
              >
                <RotateCcw size={12} /> Reset Seed Data Demo
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
