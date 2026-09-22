import React, { useState, useEffect } from 'react';
import { Activity, Zap, CheckCircle2, FileCheck2, UserCheck, Bell } from 'lucide-react';

export default function RealtimeActivityFeed() {
  const [activities, setActivities] = useState([
    { id: 1, text: "Ahmad Rizki Pratama melakukan Presensi 'Hadir'", time: "Baru saja", icon: UserCheck, color: "#10b981" },
    { id: 2, text: "Pak Budi Santoso menerbitkan Ujian CBT baru", time: "2 menit yang lalu", icon: FileCheck2, color: "#2563eb" },
    { id: 3, text: "Siti Nurhaliza mengumpulkan Tugas React JS", time: "5 menit yang lalu", icon: CheckCircle2, color: "#d97706" }
  ]);

  useEffect(() => {
    // Periodically push simulated live activities
    const feedInterval = setInterval(() => {
      const sampleEvents = [
        { text: "Muhammad Fikri baru saja login ke e-Learning", icon: Zap, color: "#8b5cf6" },
        { text: "Presensi Harian XII RPL 1 telah direkapitulasi", icon: UserCheck, color: "#10b981" },
        { text: "Nilai Tugas Basis Data ter-update otomatis", icon: CheckCircle2, color: "#2563eb" },
        { text: "Ujian CBT PTS Web telah dikerjakan 45 siswa", icon: FileCheck2, color: "#d97706" }
      ];

      const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const newActivity = {
        id: Date.now(),
        ...randomEvent,
        time: "Baru saja"
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(feedInterval);
  }, []);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
          <Activity size={18} style={{ color: 'var(--primary)' }} /> Live Activity Stream
        </h3>
        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>REALTIME</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activities.map(act => {
          const Icon = act.icon;
          return (
            <div key={act.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--bg-main)'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: `${act.color}15`, color: act.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={16} />
              </div>
              <div style={{ flex: 1, lineHeight: 1.2 }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>{act.text}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{act.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
