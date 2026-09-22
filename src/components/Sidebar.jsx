import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  CalendarCheck,
  Award,
  BellRing,
  Users,
  FileQuestion,
  Sparkles,
  ChevronRight,
  School
} from 'lucide-react';

export default function Sidebar({ currentUser, activeTab, setActiveTab }) {
  const getNavItems = () => {
    const common = [
      { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
      { id: 'courses', label: 'Mata Pelajaran', icon: BookOpen },
      { id: 'exams', label: 'Ujian Online CBT', icon: FileCheck2 },
      { id: 'assignments', label: 'Tugas & Pengumpulan', icon: FileCheck2 },
      { id: 'attendance', label: 'Presensi Kehadiran', icon: CalendarCheck },
      { id: 'grades', label: 'Transkrip & Rapor', icon: Award },
      { id: 'announcements', label: 'Pengumuman Sekolah', icon: BellRing }
    ];

    if (currentUser.role === 'admin') {
      common.push(
        { id: 'users', label: 'Manajemen User', icon: Users }
      );
    }

    return common;
  };

  const navItems = getNavItems();

  return (
    <aside className="no-print" style={{
      width: '260px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      padding: '1.25rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 'calc(100vh - 65px)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Menu Utama ({currentUser.role.toUpperCase()})
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.9rem',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-main)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} style={{ color: isActive ? '#ffffff' : 'var(--primary)' }} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} color="#ffffff" />}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div style={{
        padding: '1rem',
        borderRadius: '12px',
        background: 'var(--primary-light)',
        border: '1px solid var(--border)',
        marginTop: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <School size={16} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>SMKN 1 CIBINONG</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
          Tahun Ajaran 2025/2026 Ganjil • Versi LMS 2.5 (CBT & Rapor Ready)
        </p>
      </div>
    </aside>
  );
}
