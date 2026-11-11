# Sistem Review Kantin — Frontend & Backend Integration (Tugas 4)

Proyek ini merupakan implementasi penuh sistem informasi **Review Kantin** yang mengintegrasikan backend REST API (Express.js, Drizzle ORM, SQL Server, JWT Authentication) dengan frontend antarmuka pengguna berbasis **React (TypeScript)** menggunakan **Fetch API** untuk komunikasi HTTP.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Framework / Library**: React 19 (TypeScript)
- **Build Tool**: Vite
- **Routing**: React Router DOM (v7)
- **Komunikasi HTTP**: **Fetch API** (sesuai ketentuan Tugas 4)
- **Styling**: Modern CSS dengan CSS Variables, responsif & UX modern

### Backend
- **Runtime & Framework**: Node.js, Express.js 5
- **Database & ORM**: Microsoft SQL Server (MSSQL), Drizzle ORM
- **Autentikasi & Otorisasi**: JSON Web Token (JWT), BcryptJS
- **Validasi**: Zod Schema Validation
- **Dokumentasi API**: Swagger UI (`swagger-autogen`, `swagger-ui-express`)
- **CORS**: `cors` middleware untuk komunikasi cross-origin dengan frontend

---

## 📁 Struktur Direktori

```
Tugas3PrakRsi/
├── .gitignore                # Git ignore root
├── README.md                 # Dokumentasi proyek lengkap
│
├── backend/                  # Aplikasi Backend Express (TypeScript)
│   ├── .env.example          # Template konfigurasi environment backend
│   ├── .gitignore            # Git ignore backend
│   ├── package.json          # Dependencies backend
│   ├── tsconfig.json         # Konfigurasi TypeScript backend
│   ├── drizzle.config.ts     # Konfigurasi Drizzle ORM
│   └── src/                  # Source code backend
│       ├── controllers/      # Handler endpoint (auth, stall, menu, dll.)
│       ├── db/               # Skema Drizzle ORM & koneksi database MSSQL
│       ├── dtos/             # Data Transfer Objects
│       ├── errors/           # Custom AppError (401, 403, 404, validasi)
│       ├── middlewares/      # authMiddleware (authenticate, authorize), validate, errorHandler
│       ├── repositories/     # Akses query database dengan Drizzle
│       ├── routes/           # Express routers (/auth, /stalls, dll.)
│       ├── schemas/          # Zod validation schemas
│       ├── services/         # Logika bisnis
│       └── index.ts          # Entry point server Express
│
└── frontend/                 # Aplikasi Frontend React (TypeScript)
    ├── .env.example          # Template konfigurasi environment frontend
    ├── package.json          # Dependencies frontend (React, Router, Vite)
    ├── vite.config.ts        # Konfigurasi Vite & proxy
    └── src/
        ├── api/              # Modul komunikasi Fetch API (config, authApi, stallApi)
        ├── components/       # Komponen UI (Navbar, LoadingSpinner, EmptyState)
        ├── contexts/         # AuthContext (state user, role, token)
        ├── pages/            # Halaman aplikasi
        │   ├── StallListPage.tsx    # Daftar warung + search + filter + pagination
        │   ├── StallDetailPage.tsx  # Detail warung + aksi role (edit/delete)
        │   ├── StallFormPage.tsx    # Form tambah & ubah warung
        │   ├── LoginPage.tsx        # Halaman autentikasi login
        │   ├── RegisterPage.tsx     # Halaman pendaftaran pengguna
        │   └── ProfilePage.tsx      # Halaman profil pengguna (GET /auth/me)
        ├── App.tsx           # Router & Provider
        └── App.css           # Styling antarmuka
```

---

## ⚙️ Instalasi & Konfigurasi Environment

### 1. Prasyarat
- Node.js (versi >= 18 atau >= 22)
- npm
- Microsoft SQL Server yang sudah berjalan

### 2. Setup Backend
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Salin file environment:
   ```bash
   cp .env.example .env
   ```
   Sesuaikan parameter database di `.env`:
   ```env
   DB_SERVER=localhost
   DB_PORT=1433
   DB_USER=praktikum_user
   DB_PASSWORD=Praktikum2026!
   DB_NAME=review_kantin
   DB_ENCRYPT=false
   DB_TRUST_SERVER_CERTIFICATE=true
   JWT_SECRET=rahasia_kantin_super_aman
   ```
3. Install dependencies backend (jika belum):
   ```bash
   npm install
   ```

### 3. Setup Frontend
1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Salin file environment frontend:
   ```bash
   cp .env.example .env
   ```
   Isi `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```
3. Install dependencies frontend (jika belum):
   ```bash
   npm install
   ```

---

## 🚀 Cara Menjalankan Aplikasi

Jalankan backend dan frontend pada dua terminal terpisah:

### Terminal 1: Menjalankan Backend Express
```bash
# Dari folder backend
cd backend
npm run dev
```
Server backend berjalan di: `http://localhost:3000`  
Dokumentasi Swagger API: `http://localhost:3000/docs`

### Terminal 2: Menjalankan Frontend React
```bash
# Dari folder frontend
cd frontend
npm run dev
```
Frontend dapat diakses di browser pada: `http://localhost:5173`

---

## 📋 Fitur yang Diimplementasikan

### 1. Autentikasi & Profil Pengguna
- **Registrasi Akun (`POST /auth/register`)**: Pendaftaran user baru dengan enkripsi password (bcrypt) dan validasi Zod.
- **Login Akun (`POST /auth/login`)**: Autentikasi kredensial pengguna dan penyimpanan JWT token pada localStorage.
- **Informasi Profil (`GET /auth/me`)**: Menampilkan identitas, role, dan tanggal pendaftaran user yang sedang aktif.
- **Logout**: Menghapus token dari localStorage dan mereset status login di aplikasi.

### 2. Pengelolaan Warung (CRUD Stalls)
- **Read Daftar Warung (`GET /stalls`)**:
  - Menampilkan daftar warung dalam format kartu grid interaktif.
  - Fitur pencarian berdasarkan nama warung (`?search=...`).
  - Fitur filter kategori (`?category=...`).
  - Fitur pagination (`?page=...&limit=...`).
- **Read Detail Warung (`GET /stalls/:id`)**:
  - Menampilkan detail informasi lengkap warung (nama, kategori, lokasi, deskripsi, rating rata-rata, jumlah ulasan, owner ID, dan badge popularitas).
- **Create Warung (`POST /stalls`)**:
  - Form penambahan warung baru.
  - Hanya dapat diakses oleh user dengan role `Admin` atau `Owner`.
- **Update Warung (`PUT /stalls/:id`)**:
  - Form pengubahan informasi warung yang sudah ada.
  - Hanya dapat dilakukan oleh `Admin` atau `Owner` pemilik warung tersebut.
- **Delete Warung (`DELETE /stalls/:id`)**:
  - Penghapusan warung dengan modal konfirmasi.
  - Sesuai aturan backend, hak hapus hanya dimiliki oleh role `Admin`.

### 3. Penegakan Hak Akses Berdasarkan Role (RBAC)
- **Public (Belum Login)**:
  - Dapat melihat daftar warung dan detail warung.
  - Tombol tambah/edit/hapus tidak tersedia.
  - Jika mengakses langsung halaman tambah/edit (`/stalls/new` atau `/stalls/:id/edit`), aplikasi menampilkan pesan penanganan perlindungan (Requirement 9) dan mengarahkan ke halaman login.
- **Admin**:
  - Memiliki hak akses penuh CRUD ke seluruh warung.
- **Owner**:
  - Dapat membuat warung baru (otomatis terikat dengan ID owner-nya).
  - Hanya dapat mengedit warung milik dirinya sendiri.
  - Jika mencoba mengubah warung milik owner lain, sistem menolak dengan pesan error **403 Forbidden**.
  - Tidak dapat menghapus warung (ditangani sesuai otorisasi backend).
- **Customer**:
  - Hanya dapat melihat daftar dan detail warung tanpa akses pengelolaan warung.

### 4. Penanganan State (Loading, Empty, & Error)
- **Loading State**: Terdapat indikator spinner visual saat memuat data dari backend atau memproses formulir.
- **Empty State**: Menampilkan ilustrasi dan pesan informatif saat tidak ada warung yang ditemukan atau hasil pencarian kosong.
- **Error State**: Menampilkan penanganan respons error HTTP secara terperinci (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, dan 500 Internal Server Error) serta penanganan error jaringan bila backend tidak terhubung.
