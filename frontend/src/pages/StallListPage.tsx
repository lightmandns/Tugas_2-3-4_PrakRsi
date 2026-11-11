import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStalls, type Stall } from '../api/stallApi';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

// Helper icon makanan berdasarkan kategori warung
function getCategoryIcon(category: string | null) {
  if (!category) return '🍲';
  const cat = category.toLowerCase();
  if (cat.includes('minum') || cat.includes('kopi') || cat.includes('teh')) return '🥤';
  if (cat.includes('mie') || cat.includes('bakso')) return '🍜';
  if (cat.includes('nasi')) return '🍛';
  if (cat.includes('ringan') || cat.includes('snack')) return '🥟';
  return '🍲';
}

export default function StallListPage() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter, search, and pagination state
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const [total, setTotal] = useState<number>(0);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchStalls = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStalls({
        search: search.trim() || undefined,
        category: category || undefined,
        page,
        limit,
      });

      if (response.data) {
        setStalls(response.data);
      }
      if (response.meta) {
        setTotal(response.meta.total);
      }
    } catch (err: unknown) {
      const errMsg = (err as { message?: string })?.message || 'Gagal memuat daftar warung';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStalls();
  }, [page, category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStalls();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div>
      {/* Bar Pencarian & Filter Kategori */}
      <form onSubmit={handleSearchSubmit} className="filter-container">
        <input
          type="text"
          className="filter-input"
          placeholder="Cari nama warung ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={handleCategoryChange} className="filter-select">
          <option value="">Semua Kategori</option>
          <option value="Makanan Berat">Makanan Berat</option>
          <option value="Makanan Ringan">Makanan Ringan</option>
          <option value="Minuman">Minuman</option>
          <option value="Aneka Nasi">Aneka Nasi</option>
          <option value="Mie & Bakso">Mie & Bakso</option>
          <option value="Kopi & Teh">Kopi & Teh</option>
        </select>
        <button type="submit" className="filter-btn-search">
          Cari
        </button>
        {(search || category) && (
          <button
            type="button"
            className="filter-btn-reset"
            onClick={() => {
              setSearch('');
              setCategory('');
              setPage(1);
            }}
          >
            Reset
          </button>
        )}
      </form>

      {/* Error Feedback */}
      {error && (
        <div className="alert-box alert-error" style={{ justifyContent: 'space-between' }}>
          <span>⚠️ {error}</span>
          <button className="filter-btn-reset" onClick={fetchStalls} style={{ padding: '4px 10px' }}>
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <LoadingSpinner message="Mengambil data warung kantin..." />
      ) : stalls.length === 0 ? (
        /* Empty State */
        <EmptyState
          icon="🍲"
          title="Tidak ada warung yang ditemukan"
          subtitle={search || category ? 'Coba ubah kata kunci atau filter pencarian Anda' : 'Belum ada warung terdaftar di sistem.'}
        />
      ) : (
        /* Grid Daftar Warung: Persis seperti sketsa 3 kolom dengan kotak [gambar] dan [Nama Warung] */
        <div className="stalls-grid">
          {stalls.map((stall) => {
            const isOwnerOfThisStall = user?.role === 'owner' && user?.id === stall.ownerId;
            const isAdmin = user?.role === 'admin';

            return (
              <div
                key={stall.id}
                className="stall-item-card"
                onClick={() => navigate(`/stalls/${stall.id}`)}
                title={`Klik untuk melihat detail ${stall.name}`}
              >
                {/* Kotak [gambar] sesuai sketsa */}
                <div className="stall-thumb-box">
                  <span className="stall-thumb-icon">{getCategoryIcon(stall.category)}</span>
                  <span>[gambar]</span>
                </div>

                {/* Konten Kanan: [Nama Warung] & Informasi */}
                <div className="stall-content">
                  <div>
                    <div className="stall-title-row">
                      <h3 className="stall-name" title={stall.name}>
                        {stall.name}
                      </h3>
                      {stall.isPopular && (
                        <span className="stall-popular-tag">★ Populer</span>
                      )}
                    </div>

                    {stall.category && (
                      <span className="stall-category-badge">{stall.category}</span>
                    )}

                    <div className="stall-location-text">
                      📍 {stall.location || 'Lokasi kantin'}
                    </div>

                    {/* Tag Khusus Role Owner jika ini warung miliknya */}
                    {isOwnerOfThisStall && (
                      <span className="stall-ownership-tag">
                        ✓ Warung Anda
                      </span>
                    )}
                    {isAdmin && (
                      <span style={{ fontSize: '0.7rem', color: '#fef08a' }}>
                        ID #{stall.id} • Owner #{stall.ownerId}
                      </span>
                    )}
                  </div>

                  {/* Rating dan Ulasan di bagian bawah kartu */}
                  <div className="stall-footer-info">
                    <div className="stall-stars">
                      ⭐ {Number(stall.avgRating).toFixed(1)}
                      <span className="stall-review-count">({stall.reviewCount} ulasan)</span>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>
                      Detail →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {!loading && stalls.length > 0 && totalPages > 1 && (
        <div className="pagination-bar">
          <button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            ← Sebelumnya
          </button>
          <span className="pagination-text">
            Halaman {page} dari {totalPages} (Total: {total} warung)
          </span>
          <button
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            Selanjutnya →
          </button>
        </div>
      )}
    </div>
  );
}
