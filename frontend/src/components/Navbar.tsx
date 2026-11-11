import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/stalls');
  };

  const canCreateStall = user && (user.role === 'admin' || user.role === 'owner');

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand / Logo sesuai sketsa: Review Kantin */}
        <Link to="/stalls" className="navbar-brand">
          Review Kantin
        </Link>

        {/* Auth Actions disesuaikan berdasarkan kondisi login */}
        <div className="navbar-actions">
          {!user ? (
            /* Kondisi Belum Login (Persis seperti sketsa: Register link & Login button) */
            <>
              <Link to="/register" className="btn-nav-register">
                Register
              </Link>
              <Link to="/login" className="btn-nav-login">
                Login
              </Link>
            </>
          ) : (
            /* Kondisi Sudah Login (Menampilkan Identitas & Akses Role) */
            <div className="navbar-user-box">
              {/* Tombol Tambah Warung khusus Admin & Owner */}
              {canCreateStall && (
                <Link to="/stalls/new" className="btn-nav-action">
                  + Tambah Warung
                </Link>
              )}

              {/* Badge User & Role */}
              <div className="user-badge">
                <span>{user.name}</span>
                <span className={`user-badge-role role-${user.role}`}>
                  {user.role}
                </span>
              </div>

              {/* Menu Profil (GET /auth/me) */}
              <Link to="/profile" className="btn-nav-profile">
                Profil
              </Link>

              {/* Tombol Logout */}
              <button onClick={handleLogout} className="btn-nav-logout">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
