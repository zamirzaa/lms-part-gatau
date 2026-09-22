import React, { useState, useEffect } from 'react';
import { Clock, Activity, ShieldCheck, Radio } from 'lucide-react';

export default function RealtimeClockWidget() {
  const [time, setTime] = useState(new Date());
  const [onlineCount, setOnlineCount] = useState(156);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Simulate subtle real-time fluctuation in online users count
    const onlineTimer = setInterval(() => {
      setOnlineCount(prev => prev + (Math.floor(Math.random() * 3) - 1));
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(onlineTimer);
    };
  }, []);

  const timeString = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
  const dateString = time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="glass-card" style={{
      padding: '0.85rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '1rem'
    }}>
      {/* Left: Live Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#047857',
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          fontWeight: 700,
          fontSize: '0.75rem'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981',
            animation: 'pulse 1.5s infinite'
          }}></span>
          <span>● REAL-TIME LIVE</span>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Radio size={14} style={{ color: 'var(--primary)' }} />
          <span>Pengguna Aktif: <strong>{onlineCount} Online</strong></span>
        </div>
      </div>

      {/* Right: Live Digital Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{dateString}</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'monospace', lineHeight: 1 }}>
            {timeString}
          </div>
        </div>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'var(--primary-light)', color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Clock size={20} />
        </div>
      </div>
    </div>
  );
}
