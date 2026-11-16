import React from 'react';

/**
 * UserAvatar: Menampilkan avatar inisial nama resmi tanpa foto profil
 * Sesuai instruksi: "tidak perlu menggunakan poto profil"
 */
export default function UserAvatar({ user, name, role, size = 36, style = {}, className = '' }) {
  const displayName = (name || user?.name || 'User').trim();
  const displayRole = role || user?.role || 'siswa';

  // Dapatkan inisial 2 huruf (cth: "ABRAHAM LINKCHON" -> "AL", "TIARA ANDINI" -> "TA")
  const words = displayName.split(/\s+/).filter(Boolean);
  let initials = 'U';
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length > 0) {
    initials = words[0].substring(0, Math.min(2, words[0].length)).toUpperCase();
  }

  // Warna gradien modern berdasarkan peran (Role)
  const getGradient = (r) => {
    switch (r) {
      case 'guru':
        return 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'; // Amber/Gold
      case 'admin':
        return 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'; // Crimson/Red
      case 'siswa':
      default:
        return 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'; // Royal Blue SMKN 1
    }
  };

  const fontSize = Math.max(10, Math.floor(size * 0.38));

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        background: getGradient(displayRole),
        color: '#ffffff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: `${fontSize}px`,
        letterSpacing: '0.04em',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
        userSelect: 'none',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        textTransform: 'uppercase',
        flexShrink: 0,
        ...style
      }}
      title={`${displayName} (${displayRole.toUpperCase()})`}
    >
      {initials}
    </div>
  );
}
