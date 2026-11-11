import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError('Email dan password wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/stalls');
    } catch (err: unknown) {
      const resp = err as { statusCode?: number; message?: string };
      if (resp.statusCode === 401) {
        setFormError('Login gagal (401): Email atau password salah.');
      } else {
        setFormError(resp.message || 'Terjadi kesalahan saat mencoba login.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="white-card"
      style={{ width: 400, maxWidth: 540, margin: '0 auto' }}
      >
        <h2 className="form-title"> Masuk ke Akun</h2>

        {formError && (
          <div className="alert-box alert-error">
            ⚠️ {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="nama@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-actions-row">
            <button
              type="submit"
              className="btn-form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: '#64748b' }}>
          Belum punya akun?{' '}
          <Link to="/register" style={{ color: 'var(--accent-red)', fontWeight: 700, textDecoration: 'none' }}>
            Daftar di sini
          </Link>
        </div>

        {/* Tombol Kembali di Pojok Kanan Bawah */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
          <Link to="/stalls" className="btn-orange">
            ← Kembali ke Katalog
          </Link>
        </div>
      </div>
    </div>
  );
}
