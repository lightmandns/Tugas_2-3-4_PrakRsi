import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMe, type User } from '../api/authApi';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfilePage() {
  const { logout } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMe();
      if (response.data) {
        setProfileData(response.data);
      }
    } catch (err: unknown) {
      const resp = err as { statusCode?: number; message?: string };
      if (resp.statusCode === 401) {
        setError('Sesi autentikasi telah habis (401). Silakan login kembali.');
        logout();
      } else {
        setError(resp.message || 'Gagal memuat informasi pengguna dari server.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Mengambil informasi profil dari server (GET /auth/me)..." />;
  }

  if (error || !profileData) {
    return (
      <div className="white-card form-wrapper" style={{ textAlign: 'center', marginTop: 40 }}>
        <h2 style={{ color: '#dc2626', marginBottom: 12 }}>⚠️ Gagal Memuat Profil</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>
          {error || 'Data profil pengguna tidak tersedia.'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/login" className="btn-nav-login">
            Menuju Halaman Login
          </Link>
          <button className="btn-orange" onClick={fetchProfile}>
            Coba Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <div className="white-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: 'var(--accent-red)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              margin: '0 auto 12px',
            }}
          >
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>{profileData.name}</h2>
          <span className={`user-badge-role role-${profileData.role}`} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
            ROLE: {profileData.role.toUpperCase()}
          </span>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="detail-info-label">User ID (Database)</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>#{profileData.id}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div className="detail-info-label">Alamat Email</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>{profileData.email}</div>
          </div>

          <div style={{ marginBottom: 16, width: 1000, minWidth: 220 }}>
            <div className="detail-info-label">Kewenangan Sistem</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
              {profileData.role === 'admin' && '👑 Admin'}
              {profileData.role === 'owner' && '🏪 Owner'}
              {profileData.role === 'customer' && '👤 Customer'}
            </div>
          </div>

          {profileData.createdAt && (
            <div style={{ marginBottom: 16 }}>
              <div className="detail-info-label">Tanggal Pendaftaran</div>
              <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                {new Date(profileData.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
          <Link to="/stalls" className="btn-orange" style={{ flex: 1 }}>
            ← Kembali
          </Link>
          <button
            className="filter-btn-search"
            style={{ flex: 1, background: '#dc2626' }}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
