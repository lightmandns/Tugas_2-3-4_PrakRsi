import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createStall, updateStall, getStallById, type CreateStallInput } from '../api/stallApi';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function StallFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const stallId = Number(id);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateStallInput>({
    name: '',
    category: '',
    location: '',
    description: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingStall, setFetchingStall] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isForbidden, setIsForbidden] = useState<boolean>(false);

  useEffect(() => {
    if (isEditMode && !isNaN(stallId)) {
      setFetchingStall(true);
      getStallById(stallId)
        .then((res) => {
          if (res.data) {
            if (user && user.role === 'owner' && res.data.ownerId !== user.id) {
              setIsForbidden(true);
              setError('Akses Ditolak (403): Anda tidak berhak mengubah data warung milik owner lain.');
            }

            setFormData({
              name: res.data.name || '',
              category: res.data.category || '',
              location: res.data.location || '',
              description: res.data.description || '',
            });
          }
        })
        .catch((err: unknown) => {
          const status = (err as { statusCode?: number })?.statusCode;
          if (status === 404) {
            setError('Warung yang ingin diedit tidak ditemukan (404).');
          } else {
            setError((err as { message?: string })?.message || 'Gagal mengambil data warung.');
          }
        })
        .finally(() => {
          setFetchingStall(false);
        });
    }
  }, [isEditMode, stallId, user]);

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    if (!formData.name.trim()) {
      errors.name = ['Nama warung wajib diisi'];
    } else if (formData.name.trim().length < 3) {
      errors.name = ['Nama warung minimal 3 karakter'];
    } else if (formData.name.trim().length > 100) {
      errors.name = ['Nama warung maksimal 100 karakter'];
    }

    if (formData.category && formData.category.length > 50) {
      errors.category = ['Kategori maksimal 50 karakter'];
    }

    if (formData.location && formData.location.length > 100) {
      errors.location = ['Lokasi maksimal 100 karakter'];
    }

    if (formData.description && formData.description.length > 1000) {
      errors.description = ['Deskripsi maksimal 1000 karakter'];
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      if (isEditMode) {
        await updateStall(stallId, formData);
        navigate(`/stalls/${stallId}`);
      } else {
        const res = await createStall(formData);
        if (res.data?.id) {
          navigate(`/stalls/${res.data.id}`);
        } else {
          navigate('/stalls');
        }
      }
    } catch (err: unknown) {
      const resp = err as { statusCode?: number; message?: string; errors?: Record<string, string[]> };
      if (resp.statusCode === 401) {
        setError('Sesi login telah habis atau Anda belum terautentikasi (401). Silakan login kembali.');
      } else if (resp.statusCode === 403) {
        setError('Akses ditolak (403): Anda tidak memiliki izin untuk melakukan aksi ini.');
      } else {
        setError(resp.message || 'Terjadi kesalahan saat menyimpan data warung');
      }

      if (resp.errors) {
        setFieldErrors(resp.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingStall) {
    return <LoadingSpinner message="Menyiapkan formulir warung..." />;
  }

  // User belum login
  if (!user) {
    return (
      <div className="white-card form-wrapper" style={{ textAlign: 'center', marginTop: 40 }}>
        <h2 style={{ marginBottom: 12, color: 'var(--text-dark)' }}>🔒 Autentikasi Diperlukan</h2>
        <p style={{ color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
          Halaman pengelolaan warung hanya dapat diakses oleh pengguna yang sudah login dengan role <strong>Admin</strong> atau <strong>Owner</strong>.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/login" className="btn-nav-login" style={{ padding: '10px 24px' }}>
            Login Sekarang
          </Link>
          <Link to="/stalls" className="btn-form-cancel">
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  // Customer dilarang mengelola warung
  if (user.role === 'customer') {
    return (
      <div className="white-card form-wrapper" style={{ textAlign: 'center', marginTop: 40 }}>
        <h2 style={{ color: '#dc2626', marginBottom: 12 }}>🚫 Akses Ditolak (403 Forbidden)</h2>
        <p style={{ color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
          Akun Anda memiliki role <strong>Customer</strong>. Hak akses menambah atau mengedit warung hanya dimiliki oleh akun <strong>Owner</strong> atau <strong>Admin</strong>.
        </p>
        <Link to="/stalls" className="btn-orange">
          ← Kembali ke Katalog Warung
        </Link>
      </div>
    );
  }

  // Owner dilarang mengedit warung orang lain
  if (isForbidden) {
    return (
      <div className="white-card form-wrapper" style={{ textAlign: 'center', marginTop: 40 }}>
        <h2 style={{ color: '#dc2626', marginBottom: 12 }}>🚫 Akses Ditolak (403 Forbidden)</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>
          {error}
        </p>
        <Link to="/stalls" className="btn-orange">
          ← Kembali ke Katalog Warung
        </Link>
      </div>
    );
  }

  return (
    <div className="form-wrapper"
    style={{ display: 'flex', justifyContent: 'center', padding: '24px 16px' }}
    >
      <div className="white-card"
      style={{ width: 1000, maxWidth: 540, margin: '0 auto' }}
      >
        <h2 className="form-title">
          {isEditMode ? '✏️ Ubah Data Warung' : 'Tambah Warung Baru'}
        </h2>

        {error && (
          <div className="alert-box alert-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Nama Warung <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Contoh: Warung Barokah Bu Siti"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              required
            />
            {fieldErrors.name && (
              <small style={{ color: '#dc2626', marginTop: 4, display: 'block' }}>
                {fieldErrors.name.join(', ')}
              </small>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">
              Kategori Warung
            </label>
            <select
              id="category"
              className="form-select"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={loading}
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="Makanan Berat">Makanan Berat</option>
              <option value="Makanan Ringan">Makanan Ringan</option>
              <option value="Minuman">Minuman</option>
              <option value="Aneka Nasi">Aneka Nasi</option>
              <option value="Mie & Bakso">Mie & Bakso</option>
              <option value="Kopi & Teh">Kopi & Teh</option>
            </select>
            {fieldErrors.category && (
              <small style={{ color: '#dc2626', marginTop: 4, display: 'block' }}>
                {fieldErrors.category.join(', ')}
              </small>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Lokasi / Nomor Stand
            </label>
            <input
              id="location"
              type="text"
              className="form-input"
              placeholder="Contoh: Gedung Fasilkom Lantai 1 Stand 02"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={loading}
            />
            {fieldErrors.location && (
              <small style={{ color: '#dc2626', marginTop: 4, display: 'block' }}>
                {fieldErrors.location.join(', ')}
              </small>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Deskripsi Singkat
            </label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Jelaskan menu favorit, promo, atau catatan khas warung..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
            />
            {fieldErrors.description && (
              <small style={{ color: '#dc2626', marginTop: 4, display: 'block' }}>
                {fieldErrors.description.join(', ')}
              </small>
            )}
          </div>

          <div className="form-actions-row">
            <button
              type="button"
              className="btn-form-cancel"
              disabled={loading}
              onClick={() => navigate(-1)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-form-submit"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Buat Warung'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
