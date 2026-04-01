# Deploy Gratis dengan Render + Supabase

Project ini sekarang sudah siap memakai PostgreSQL. Jalur gratis yang paling sederhana untuk demo adalah:

- Backend Express: Render Web Service
- Database PostgreSQL: Supabase Free

Catatan penting:

- Render Free Web Service cocok untuk demo/hobby, bukan production.
- Supabase menyediakan beberapa connection string. Untuk backend Express di Render, paling aman mulai dari `Supavisor session mode`.

Sumber resmi:

- [Render Web Services](https://render.com/docs/web-services)
- [Render Blueprint spec](https://render.com/docs/blueprint-spec)
- [Supabase connection strings](https://supabase.com/docs/reference/postgres/connection-strings)

## Langkah 1: Push project ke GitHub

Pastikan project ini ada di repository GitHub.

## Langkah 2: Buat project di Supabase

Di dashboard Supabase:

1. Buat project baru
2. Tunggu database selesai dibuat
3. Klik tombol `Connect`
4. Salin connection string PostgreSQL

Pilih yang ini dulu:

- `Session pooler` / `Supavisor session mode`

Kenapa:

- dari dokumentasi Supabase, direct connection default memakai IPv6
- session pooler lebih aman kalau environment jaringan tidak pakai IPv6
- ini cocok untuk backend yang berjalan terus seperti Express di Render

## Langkah 3: Import schema dan seed ke Supabase

Gunakan connection string Supabase tadi:

```powershell
psql "DATABASE_URL_DARI_SUPABASE" -f database/schema.sql
psql "DATABASE_URL_DARI_SUPABASE" -f database/seed.sql
```

## Langkah 4: Deploy ke Render

Di Render:

1. Klik `New`
2. Pilih `Blueprint` jika ingin pakai [render.yaml](C:/Users/Admin/Desktop/Google%20Design/render.yaml)
3. Atau pilih `Web Service` kalau mau isi manual
3. Hubungkan repository GitHub
4. Pilih branch yang ingin di-deploy

Gunakan konfigurasi:

- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Kalau pakai Blueprint, file [render.yaml](C:/Users/Admin/Desktop/Google%20Design/render.yaml) sudah menyiapkan base config.

## Langkah 5: Tambahkan environment variable di Render

Minimal tambahkan:

- `NODE_ENV=production`
- `DATABASE_URL=<connection string session pooler dari Supabase>`

Opsional:

- `PORT` tidak perlu diisi kalau Render sudah menyediakannya

## Langkah 6: Deploy dan test

Setelah deploy selesai, buka:

- `/api/health`
- `/api/search?q=seattle`

Kalau keduanya jalan, frontend juga akan ikut jalan karena diserve dari Express.

## Environment yang dipakai app ini

App membaca environment berikut:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- atau mode lokal: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

## Checklist cepat

- Buat project Supabase
- Copy `Session pooler connection string`
- Import [schema.sql](C:/Users/Admin/Desktop/Google%20Design/database/schema.sql)
- Import [seed.sql](C:/Users/Admin/Desktop/Google%20Design/database/seed.sql)
- Push project ke GitHub
- Deploy ke Render
- Isi `DATABASE_URL`

## Test lokal

Kalau mau menjalankan lokal:

```powershell
npm install
psql -U postgres -d seattle_search -f database/schema.sql
psql -U postgres -d seattle_search -f database/seed.sql
npm start
```

Kalau database `seattle_search` belum ada:

```powershell
createdb -U postgres seattle_search
```
