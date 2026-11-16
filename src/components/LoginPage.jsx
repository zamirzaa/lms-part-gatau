import React, { useState } from 'react';
import {
  LogIn,
  Lock,
  User,
  Eye,
  EyeOff,
  Sun,
  Moon,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { apiService } from '../services/apiService';

export default function LoginPage({ onLoginSuccess, darkMode, setDarkMode }) {
  const [identityOrUsername, setIdentityOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identityOrUsername.trim()) {
      setError('Silakan masukkan NIS (Siswa) atau NIP / Username (Guru & Admin).');
      return;
    }
    if (!password) {
      setError('Silakan masukkan password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = apiService.login(identityOrUsername, password);
      setIsLoading(false);

      if (res.success) {
        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        }
      } else {
        setError(res.message || 'Login gagal. Periksa NIS/NIP dan password Anda.');
      }
    }, 300);
  };

  const handleQuickFill = (identity, defaultPass = '12345678') => {
    setIdentityOrUsername(identity);
    setPassword(defaultPass);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: darkMode ? '#0b0f19' : '#0e1626',
      backgroundImage: darkMode
        ? 'radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.12), transparent 45%), radial-gradient(circle at 80% 80%, rgba(13, 148, 136, 0.08), transparent 40%)'
        : 'radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.15), transparent 50%), radial-gradient(circle at 80% 80%, rgba(13, 148, 136, 0.1), transparent 40%)',
      padding: '1.5rem',
      position: 'relative',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Top Right Controls: Theme Toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#f8fafc',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {darkMode ? <Sun size={19} style={{ color: '#fbbf24' }} /> : <Moon size={19} />}
        </button>
      </div>

      {/* Main Login Card - Designed matching exact portal specifications */}
      <div style={{
        width: '100%',
        maxWidth: '430px',
        backgroundColor: '#131b2e',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        padding: '2.5rem 2.25rem',
        boxSizing: 'border-box',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Official School Crest Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <img
            src="/logo-smkn1.png"
            alt="Logo Resmi SMKN 1 Cibinong"
            style={{
              height: '68px',
              width: 'auto',
              objectFit: 'contain',
              margin: '0 auto',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          />
        </div>

        {/* Header Text */}
        <div style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
          <h2 style={{
            color: '#f8fafc',
            fontSize: '1.65rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 0.35rem 0'
          }}>
            Masuk
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '0.88rem',
            margin: 0,
            fontWeight: 500
          }}>
            Portal Digital SMKN 1 Cibinong
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            padding: '0.75rem 0.9rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '1.25rem',
            lineHeight: 1.4
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Identity/Username Field */}
          <div>
            <label style={{
              display: 'block',
              color: '#cbd5e1',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '0.45rem'
            }}>
              NIS / NIP / Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={identityOrUsername}
                onChange={(e) => setIdentityOrUsername(e.target.value)}
                placeholder="NIS / NIP"
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  paddingLeft: '1rem',
                  backgroundColor: '#1a243a',
                  border: '1px solid #2d3b55',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#2d3b55';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{
                color: '#cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 600
              }}>
                Password
              </label>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Default: 12345678
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.75rem 0.75rem 1rem',
                  backgroundColor: '#1a243a',
                  border: '1px solid #2d3b55',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#2d3b55';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.2rem'
                }}
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.8rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#2563eb';
            }}
          >
            {isLoading ? (
              <span>Memverifikasi akun...</span>
            ) : (
              <>
                <span>Masuk</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Help & Demo Guide */}
        <div style={{ marginTop: '1.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            style={{
              background: 'none',
              border: 'none',
              color: '#60a5fa',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              margin: '0 auto',
              fontWeight: 600
            }}
          >
            <HelpCircle size={14} />
            {showHelp ? 'Tutup Petunjuk Akun' : 'Bantuan Akun & Contoh NIS Siswa'}
          </button>

          {showHelp && (
            <div style={{
              marginTop: '0.85rem',
              padding: '0.85rem',
              backgroundColor: 'rgba(26, 36, 58, 0.8)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.76rem',
              color: '#cbd5e1',
              lineHeight: 1.5
            }}>
              <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                🔑 Info Kredensial Resmi SMKN 1 Cibinong:
              </div>
              <ul style={{ paddingLeft: '1.1rem', margin: '0 0 0.65rem 0' }}>
                <li>
                  <strong>Siswa Kelas XII SIJA 2:</strong> Gunakan NIS (cth: <code>1024012417</code>).
                </li>
                <li>
                  <strong>Guru:</strong> Gunakan NIP (cth: <code>198504122010011002</code> / Budi Santoso).
                </li>
                <li>
                  <strong>Admin:</strong> Gunakan NIP (<code>197803112005011003</code> / <code>admin.kurikulum</code>).
                </li>
                <li>
                  <strong>Password:</strong> <code>12345678</code> (berlaku untuk semua akun).
                </li>
              </ul>

              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Klik cepat untuk mengisi otomatis:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickFill('1024012417')}
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#1e293b',
                    color: '#93c5fd',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Siswa: Abraham (1024012417)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('198504122010011002')}
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#1e293b',
                    color: '#fcd34d',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Guru: Budi Santoso
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('197803112005011003')}
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#1e293b',
                    color: '#fca5a5',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Admin: Dra. Endang
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: '1.5rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.75rem'
      }}>
        © 2026 SMK Negeri 1 Cibinong • Sistem Pembelajaran Mandiri & CBT
      </div>
    </div>
  );
}
