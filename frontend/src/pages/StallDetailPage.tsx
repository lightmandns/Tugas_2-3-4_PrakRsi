import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStallById, deleteStall, type Stall } from '../api/stallApi';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function StallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const stallId = Number(id);

  const fetchStall = async () => {
    if (isNaN(stallId)) {
      setError('ID warung tidak valid');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getStallById(stallId);
      if (response.data) {
        setStall(response.data);
      } else {
        setError('Data warung tidak ditemukan');
      }
    } catch (err: unknown) {
      const status = (err as { statusCode?: number })?.statusCode;
      if (status === 404) {
        setError('Data warung tidak ditemukan (404)');
      } else {
        const msg = (err as { message?: string })?.message || 'Gagal memuat detail warung';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStall();
  }, [stallId]);

  const handleDelete = async () => {
    setDeleting(true);
    setActionError(null);
    try {
      await deleteStall(stallId);
      navigate('/stalls', { replace: true });
    } catch (err: unknown) {
      const status = (err as { statusCode?: number })?.statusCode;
      const msg = (err as { message?: string })?.message || 'Gagal menghapus warung';
      if (status === 403) {
        setActionError(`Akses Ditolak (403): ${msg}. Hanya Admin yang memiliki izin menghapus warung.`);
      } else if (status === 401) {
        setActionError('Autentikasi Diperlukan (401): Silakan login terlebih dahulu.');
      } else {
        setActionError(msg);
      }
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';
  const isCurrentStallOwner = isOwner && stall && user?.id === stall.ownerId;
  const canEdit = isAdmin || isCurrentStallOwner;
  const canDelete = isAdmin;

  if (loading) {
    return <LoadingSpinner message="Memuat informasi detail warung..." />;
  }

  if (error || !stall) {
    return (
      <div className="white-card detail-container" style={{ textAlign: 'center', marginTop: 40 }}>
        <EmptyState
          icon="🔍"
          title={error || 'Warung Tidak Ditemukan'}
          subtitle="Warung yang Anda cari mungkin telah dihapus atau URL tidak tepat."
        />
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button className="btn-orange" onClick={() => navigate('/stalls')}>
            ← Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      {/* Alert Error Tindakan */}
      {actionError && (
        <div className="alert-box alert-error">
          ⚠️ {actionError}
        </div>
      )}

      {/* Info Hak Akses Owner */}
      {user && isOwner && !isCurrentStallOwner && (
        <div className="alert-box alert-info">
          ℹ️ Anda login sebagai <strong>Owner</strong>. Anda hanya dapat mengelola warung milik Anda sendiri (Owner ID: {user.id}).
        </div>
      )}

      {/* Kartu Putih Detail Warung */}
      <div className="white-card">
        <div className="detail-header-flex">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)' }}>{stall.name}</h1>
              {stall.isPopular && <span className="stall-popular-tag">★ Populer</span>}
              {stall.category && (
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700 }}>
                  {stall.category}
                </span>
              )}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.95rem', marginTop: 6 }}>
              📍 {stall.location || 'Lokasi kantin belum ditentukan'}
            </div>
          </div>

          {/* Action buttons berdasarkan role pengguna */}
          <div className="detail-actions">
            {canEdit && (
              <Link to={`/stalls/${stall.id}/edit`} className="btn-nav-action">
                ✏️ Edit Warung
              </Link>
            )}

            {isOwner && !isCurrentStallOwner && (
              <button
                className="btn-form-cancel"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                title="Anda bukan pemilik warung ini"
                onClick={() => setActionError('Akses Ditolak (403): Anda tidak dapat mengubah warung milik owner lain.')}
              >
                ✏️ Edit (Terkunci)
              </button>
            )}

            {canDelete && (
              <button
                className="filter-btn-search"
                style={{ background: '#dc2626', padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => setDeleteModalOpen(true)}
              >
                🗑️ Hapus
              </button>
            )}

            {isOwner && isCurrentStallOwner && !isAdmin && (
              <button
                className="btn-form-cancel"
                style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '8px 14px', fontSize: '0.85rem' }}
                onClick={() => setActionError('penghapusan warung hanya dapat dilakukan oleh Admin.')}
              >
                🗑️ Hapus (Admin Saja)
              </button>
            )}
          </div>
        </div>

        {/* Deskripsi */}
        <div style={{ margin: '20px 0', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div className="detail-info-label">Deskripsi Warung</div>
          <p style={{ whiteSpace: 'pre-line', color: '#334155', lineHeight: 1.7 }}>
            {stall.description || 'Tidak ada deskripsi tersedia untuk warung ini.'}
          </p>
        </div>

        {/* Metadata Informasi */}
        <div className="detail-grid-info">
          <div className="detail-info-card">
            <div className="detail-info-label">Rating Rata-rata</div>
            <div className="detail-info-value" style={{ color: '#eab308' }}>
              ⭐ {Number(stall.avgRating).toFixed(1)} / 5.0
            </div>
          </div>

          <div className="detail-info-card">
            <div className="detail-info-label">Jumlah Ulasan</div>
            <div className="detail-info-value">{stall.reviewCount} ulasan</div>
          </div>

          <div className="detail-info-card">
            <div className="detail-info-label">ID Pemilik (Owner ID)</div>
            <div className="detail-info-value">User #{stall.ownerId}</div>
          </div>

          <div className="detail-info-card">
            <div className="detail-info-label">Status Kepopuleran</div>
            <div className="detail-info-value">
              {stall.isPopular ? '🔥 Populer (Rating ≥ 4.7)' : 'Standar'}
            </div>
          </div>
        </div>

        {/* Tombol Navigasi Kembali di Pojok Kanan Bawah */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
          <Link to="/stalls" className="btn-orange">
            ← Kembali ke Katalog
          </Link>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 10 }}>Konfirmasi Hapus Warung</h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: 24, lineHeight: 1.5 }}>
              Apakah Anda yakin ingin menghapus warung <strong>"{stall.name}"</strong>? Tindakan ini akan menghapus data dari database.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                className="btn-form-cancel"
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                disabled={deleting}
                onClick={() => setDeleteModalOpen(false)}
              >
                Batal
              </button>
              <button
                className="filter-btn-search"
                style={{ background: '#dc2626', padding: '8px 16px', fontSize: '0.88rem' }}
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
