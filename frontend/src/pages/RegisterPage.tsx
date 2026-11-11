import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const errors: Record<string, string[]> = {};

    if (!name.trim()) {
      errors.name = ['Nama lengkap wajib diisi'];
    } else if (name.trim().length < 3) {
      errors.name = ['Nama minimal 3 karakter'];
    }

    if (!email.trim()) {
      errors.email = ['Email wajib diisi'];
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = ['Format email tidak valid'];
    }

    if (!password) {
      errors.password = ['Password wajib diisi'];
    } else if (password.length < 8) {
      errors.password = ['Password minimal 8 karakter'];
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccessMsg('Registrasi berhasil! Mengalihkan Anda ke halaman login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: unknown) {
      const resp = err as { message?: string; errors?: Record<string, string[]> };
      setFormError(resp.message || 'Terjadi kesalahan saat registrasi.');
      if (resp.errors) {
        setFieldErrors(resp.errors);
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
        <h2 className="form-title">Registrasi Akun Baru</h2>

        {formError && (
          <div className="alert-box alert-error">
            ⚠️ {formError}
          </div>
        )}

        {successMsg && (
          <div className="alert-box alert-success">
            ✅ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.name && (
              <small style={{ color: '#dc2626', marginTop: 4, display: 'block' }}>
                {fieldErrors.name.join(', ')}
              </small>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="budi@student.ub.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.email && (
              <small style={{ color: '#dc2626', marginTop: 4, display: 'block' }}>
                {fieldErrors.email.join(', ')}
              </small>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Kata Sandi (Min. 8 Karakter)
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.password && (
              <small style={{ color: '#dc2626', marginTop: 4, display: 'block' }}>
                {fieldErrors.password.join(', ')}
              </small>
            )}
          </div>

          <div className="form-actions-row">
            <button
              type="submit"
              className="btn-form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: '#64748b' }}>
          Sudah memiliki akun?{' '}
          <Link to="/login" style={{ color: 'var(--accent-red)', fontWeight: 700, textDecoration: 'none' }}>
            Masuk di sini
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
