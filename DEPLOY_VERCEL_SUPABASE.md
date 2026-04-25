# Deploy ke Vercel + Supabase

Project ini memakai:

- frontend statis dari folder `public`
- backend Express
- PostgreSQL

Konfigurasi sudah disiapkan agar Vercel mendeteksi Express app dari file [index.js](C:/Users/Admin/Desktop/Google%20Design/index.js), sesuai pola yang didukung Vercel untuk Express. Sumber resmi: [Express on Vercel](https://vercel.com/docs/frameworks/backend/express).

## 1. Siapkan database di Supabase

1. Buat project baru di Supabase.
2. Buka `Connect`.
3. Copy connection string PostgreSQL.

Untuk Vercel, gunakan connection string `Transaction pooler` lebih dulu karena Vercel bersifat serverless. Dokumentasi Supabase menyebut transaction pooler ideal untuk serverless/transient connections, dengan catatan prepared statements tidak didukung. Sumber resmi: [Supabase connection strings](https://supabase.com/docs/guides/database/connecting-to-postgres).

Format umumnya:

```env
DATABASE_URL=postgres://postgres:[PASSWORD]@db.<project-ref>.supabase.co:6543/postgres
```

## 2. Import schema dan seed

Jalankan dari local machine:

```powershell
psql "DATABASE_URL_DARI_SUPABASE" -f database/schema.sql
psql "DATABASE_URL_DARI_SUPABASE" -f database/seed.sql
```

Kalau `psql` belum ada, install PostgreSQL client tools dulu.

## 3. Push project ke GitHub

Project harus ada di repository GitHub sebelum di-import ke Vercel.

## 4. Import ke Vercel

1. Login ke Vercel.
2. Klik `Add New Project`.
3. Pilih repository GitHub project ini.
4. Framework preset: `Other`.

File [vercel.json](C:/Users/Admin/Desktop/Google%20Design/vercel.json) sudah menyiapkan:

- `framework: null`
- `cleanUrls: true`
- timeout function dasar

## 5. Tambahkan environment variables di Vercel

Tambahkan minimal:

- `DATABASE_URL`
- `NODE_ENV=production`

Opsional untuk local only:

- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

Di Vercel production, cukup `DATABASE_URL`.

## 6. Deploy dan verifikasi

Setelah deploy selesai, cek:

- `/api/health`
- `/api/search?q=seattle`
- halaman utama `/`

Jika `/api/health` gagal, masalah paling umum:

- connection string salah
- schema belum di-import
- Supabase pooler yang dipakai tidak cocok

## Catatan penting tentang pooler Supabase

Supabase menyebut:

- direct connection cocok untuk persistent server
- session pooler cocok bila perlu IPv4 untuk server yang lebih long-lived
- transaction pooler cocok untuk serverless/transient connections

Karena Vercel menjalankan Functions, mulai dari `Transaction pooler` adalah asumsi yang paling defensible.

Jika nanti ada masalah driver `pg` dengan prepared statements di transaction pooler, jalur cadangan yang paling aman adalah:

1. ganti library DB ke `postgres` / `postgres.js`, atau
2. pindah ke direct/session pooler bila environment dan koneksi mendukung

## Referensi resmi

- [Express on Vercel](https://vercel.com/docs/frameworks/backend/express)
- [vercel.json configuration](https://vercel.com/docs/project-configuration/vercel-json)
- [Supabase Postgres connection strings](https://supabase.com/docs/guides/database/connecting-to-postgres)
