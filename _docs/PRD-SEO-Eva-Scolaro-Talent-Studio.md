# PRD SEO — Eva Scolaro Talent Studio (evascolarotalentstudio.com)
**Versi:** Draft awal v1.0
**Tanggal:** 17 Juli 2026

---

## 1. Ringkasan Audit Website Saat Ini

**Struktur situs (WordPress + Elementor, one-page utama):**

| Elemen | Kondisi saat ini | Catatan SEO |
|---|---|---|
| Homepage | Satu halaman panjang berisi Hero, Pricing, Timetable, About, Location, Registration form | Semua kelas & lokasi "terkubur" dalam 1 URL — tidak bisa ranking untuk keyword spesifik per kelas |
| Title/Meta | Satu title & meta description generik ("Bali's #1 Performing Arts Studio for Kids") untuk seluruh domain | Bagus untuk brand query, tapi tidak menangkap keyword kelas/lokasi spesifik |
| Halaman lain yang sudah ada | `/gallery/`, `/concerts-documentary/`, `/practice/`, `/dancewear/`, `/announcement/`, `/terms-conditions/`, `/contact/` | Struktur dasar sudah ada, tapi tidak ada halaman per kelas atau per lokasi studio |
| Timetable | Ditampilkan sebagai tab/accordion (Sanur, Canggu, AIS, Dyatmika, Toki Hub) dalam 1 halaman | Konten jadwal kaya tapi kemungkinan tersembunyi di balik JS tab — sulit di-index penuh oleh Google |
| Local SEO | Dua studio (Canggu & Sanur) tapi tidak ada landing page khusus lokasi | Kehilangan potensi ranking "kids dance class canggu" vs "kids dance class sanur" secara terpisah |
| Blog/konten edukasi | Tidak ada. "News" hanya berisi pengumuman internal | Tidak ada konten untuk menangkap keyword informational (mis. "manfaat ballet untuk anak", "usia ideal anak mulai dance class") |
| Structured data | Tidak terdeteksi markup Course/LocalBusiness/FAQ pada saat fetch | Peluang besar untuk rich snippet di hasil pencarian |
| Internal linking | Minim — sebagian besar navigasi mengarah ke anchor (`#price`, `#timetable`) di homepage | Search engine kesulitan memahami hierarki & relevansi topik per kelas |
| Form registrasi | Heavy JS form (butuh JS aktif untuk render) | Risiko konten tidak sepenuhnya crawlable, dan berpotensi lambat di mobile |

**Benchmark kompetitor (hasil riset singkat):**
Kompetitor seperti *The Canggu Studio* dan *Just Dance Bali* sudah punya landing page khusus per kelas (contoh: `thecanggustudio.com/kids-ballet/`) yang menargetkan keyword spesifik dengan konten unik, testimoni, dan detail teknik/kurikulum. Ini adalah gap terbesar yang perlu ditutup.

---

## 2. Masalah & Peluang

- Website saat ini kuat secara **brand & konversi** (WA CTA, form trial jelas), tapi lemah secara **discoverability** — orang yang search "ballet class for kids Sanur" atau "hip hop class anak Canggu" kemungkinan besar tidak menemukan Eva Scolaro di halaman 1.
- Dengan 9 jenis kelas x 2 lokasi x 3 kelompok usia, ada puluhan kombinasi keyword long-tail yang saat ini tidak ditargetkan sama sekali.
- Sekolah internasional (AIS, Dyatmika, Toki Hub) sudah jadi partner CCA/ECA — ini bisa jadi konten "Trusted by" + case study yang kuat untuk SEO & kepercayaan.

---

## 3. Tujuan & Metrik Sukses

| Goal | Metrik | Target (6 bulan) |
|---|---|---|
| Naikkan organic traffic | Sesi organik/bulan (GSC/GA4) | +100% dari baseline |
| Ranking keyword kelas | Posisi top 10 untuk 15+ keyword target per kelas/lokasi | 15 keyword |
| Konversi trial class | Jumlah submit form "Book Free Trial" dari trafik organik | +50% |
| Local pack visibility | Muncul di Google Map Pack untuk "dance class [Canggu/Sanur]" | Top 3 |

---

## 4. Target Audiens

1. **Orang tua ekspat di Canggu/Sanur** — mencari aktivitas anak, sering search dalam Bahasa Inggris, sensitif terhadap kualitas & keamanan.
2. **Orang tua lokal Indonesia (Denpasar & sekitar)** — mencari harga, jadwal, transportasi.
3. **Sekolah internasional** — untuk kerja sama CCA/ECA (AIS, Dyatmika, dll).
4. **Remaja (Teen) yang mencari sendiri** — untuk kelas modeling/musical theatre/public speaking, sering searching by interest bukan lokasi.

---

## 5. Riset Keyword Awal (contoh, perlu divalidasi dengan tools seperti Ahrefs/GSC)

**Per jenis kelas (EN + ID mix karena market campuran):**
- kids ballet class Bali / Canggu / Sanur
- hip hop dance class for kids Bali
- kids singing lessons Bali
- kids drama / acting class Bali
- kids modeling class Bali
- k-pop dance class for kids Bali
- breakdance class for kids Bali
- musical theatre class for kids Bali
- public speaking class for teens Bali

**Per lokasi:**
- performing arts studio Canggu
- performing arts studio Sanur
- dance studio near [nama sekolah internasional]

**Informational (untuk blog):**
- manfaat ikut kelas dance untuk anak
- usia ideal anak mulai ballet
- persiapan anak sebelum ikut audisi/tampil di panggung
- cara memilih dance studio untuk anak di Bali

---

## 6. Lingkup (Scope)

**In scope (fase 1):**
- Halaman per jenis kelas (9 halaman)
- Halaman per lokasi studio (2 halaman)
- Optimasi on-page homepage (title, meta, heading, schema)
- Structured data: LocalBusiness (x2), Course, FAQPage
- Perbaikan internal linking dari homepage → halaman kelas/lokasi
- Google Business Profile untuk 2 lokasi

**In scope (fase 2):**
- Blog/artikel edukasi (min. 8 artikel awal)
- Halaman "Sekolah Partner" (AIS, Dyatmika, Toki Hub) sebagai social proof + backlink internal
- Review/testimoni terstruktur dengan schema Review

**Out of scope (untuk saat ini):**
- Rebuild platform (tetap WordPress/Elementor)
- E-commerce untuk dancewear (halaman sudah ada, cukup dioptimasi ringan)

---

## 7. Kebutuhan Teknis

- Pastikan semua konten timetable & kelas ter-render sebagai HTML statis (bukan hanya via JS tab) agar bisa di-crawl penuh.
- Setiap halaman baru: title tag unik, meta description unik, 1 H1, struktur H2/H3 logis.
- Implementasi schema.org: `LocalBusiness` (per lokasi), `Course` (per kelas), `FAQPage` (di tiap halaman kelas), `Review`/`AggregateRating` jika ada testimoni.
- XML sitemap update otomatis + submit ke Google Search Console.
- Optimasi gambar (alt text deskriptif berisi keyword natural, format WebP — sudah terlihat dipakai, bagus).
- Core Web Vitals: audit kecepatan loading form (karena JS-heavy) khususnya di mobile.
- Canonical tag konsisten ke versi `www`.

---

## 8. Timeline Fase (indikatif)

| Fase | Durasi | Fokus |
|---|---|---|
| Fase 1 | Minggu 1–3 | Riset keyword final, struktur URL, buat 2 halaman lokasi + 3 halaman kelas prioritas tertinggi |
| Fase 2 | Minggu 4–6 | Selesaikan sisa 6 halaman kelas, schema markup, GBP optimization |
| Fase 3 | Minggu 7–10 | Blog/konten edukasi, internal linking, backlink lokal (direktori Bali, sekolah partner) |
| Fase 4 | Ongoing | Monitoring GSC/GA4, iterasi konten berdasarkan performa |

---

## 9. Risiko

- Konten antar halaman kelas berisiko duplikat jika tidak ditulis unik per kelas (perlu brief konten jelas ke penulis/kiro-cli).
- Membuat halaman terpisah per lokasi **dan** per kelas berisiko duplicate/thin content jika tidak direncanakan strukturnya dengan hati-hati (lihat rekomendasi struktur di bagian 10).
- Form registrasi berbasis JS berat perlu dicek agar tidak menghambat Core Web Vitals.

---

## 10. Rencana Pembuatan Halaman Berdasarkan Jenis Kelas

### Struktur yang direkomendasikan (menghindari duplicate content)

Alih-alih membuat halaman terpisah untuk tiap kombinasi kelas x lokasi (18 halaman, berisiko tipis/duplikat), gunakan struktur ini:

- **9 halaman "Class Hub"** — satu per jenis kelas, mencakup info kedua lokasi + semua kelompok usia dalam satu halaman kaya konten.
- **2 halaman "Location Hub"** — satu per studio (Canggu, Sanur), berisi ringkasan semua kelas yang tersedia di lokasi itu + jadwal + peta + testimoni lokal.
- Kedua jenis halaman saling **cross-link** secara internal (halaman kelas link ke lokasi yang menyediakannya, dan sebaliknya).

### Daftar 9 halaman kelas (berdasarkan jadwal yang ditemukan di situs)

| # | Kelas | URL usulan | Keyword utama | Kelompok usia yang dibahas | Prioritas |
|---|---|---|---|---|---|
| 1 | Hip-Hop | `/classes/hip-hop/` | hip hop dance class for kids Bali | Tots, Junior, Teen | Tinggi (paling banyak jadwal) |
| 2 | Ballet | `/classes/ballet/` | kids ballet class Bali | Tots, Junior/Teen | Tinggi (kompetitor kuat di sini) |
| 3 | Singing | `/classes/singing/` | kids singing lessons Bali | Tots, Junior, Teen | Tinggi |
| 4 | K-Pop Dance | `/classes/kpop-dance/` | k-pop dance class kids Bali | Tots+Junior, Teen | Tinggi (tren pencarian naik) |
| 5 | Jazz Dance | `/classes/jazz-dance/` | jazz dance class for kids Bali | Tots, Junior | Sedang |
| 6 | Drama & Musical Theatre | `/classes/drama-musical-theatre/` | kids drama class Bali / musical theatre kids Bali | Junior, Teen | Sedang |
| 7 | Modeling | `/classes/modeling/` | kids modeling class Bali | Tots/Junior, Teen | Sedang |
| 8 | Breakdance (RnB) | `/classes/breakdance/` | breakdance class for kids Bali | Junior/Teen | Sedang |
| 9 | Public Speaking (Teen) | `/classes/public-speaking/` | public speaking class for teens Bali | Teen | Rendah (niche, volume kecil tapi konversi tinggi) |

### Elemen konten wajib di tiap halaman kelas

1. **H1** unik menyebut nama kelas + lokasi (mis. "Kelas Hip-Hop untuk Anak di Canggu & Sanur")
2. Intro singkat: apa itu kelas ini, manfaat untuk anak (fisik, sosial, kepercayaan diri)
3. Breakdown per kelompok usia (Tots / Junior / Teen) — durasi, fokus kurikulum
4. Jadwal kelas ini (ditarik otomatis dari data timetable, difilter per kelas)
5. Nama coach yang mengajar kelas ini + kredensial singkat
6. Foto/video dokumentasi kelas & pertunjukan
7. Pricing (link ke pricing pack yang relevan)
8. CTA "Book Free Trial" (form yang sudah ada, prefill kelas ini)
9. FAQ spesifik kelas (mis. "Apakah anak perlu pengalaman sebelumnya?", "Perlu kostum apa?")
10. Internal link ke halaman lokasi Canggu & Sanur

### Daftar 2 halaman lokasi

| Lokasi | URL usulan | Keyword utama | Isi utama |
|---|---|---|---|
| Canggu | `/studio/canggu/` | dance & performing arts studio Canggu | Alamat, peta, jadwal lengkap semua kelas di Canggu, testimoni lokal, jam operasional |
| Sanur | `/studio/sanur/` | dance & performing arts studio Sanur | Sama seperti di atas untuk Sanur (Head Office) |

### Halaman pendukung tambahan (fase 2, opsional tapi berdampak)

- `/school-partnerships/` — showcase kerja sama dengan AIS, Dyatmika, Toki Hub (memperkuat E-E-A-T & kepercayaan, juga peluang backlink)
- `/blog/` — hub artikel edukasi (fase 2)
- FAQ umum di homepage yang mengarah ke FAQ spesifik tiap halaman kelas

---

## 11. Langkah Selanjutnya

1. Validasi volume pencarian riil untuk daftar keyword di atas (Google Keyword Planner / Ahrefs / GSC data historis jika ada).
2. Prioritaskan 3 halaman kelas + 1 halaman lokasi untuk dibangun pertama (rekomendasi: Ballet, Hip-Hop, K-Pop, + Canggu) sebagai pilot sebelum scale ke sisanya.
3. Siapkan brief konten per halaman (agar tidak duplikat) sebelum dieksekusi lewat kiro-cli — sesuai preferensi kamu untuk prompt yang scoped & tidak over-engineered, brief ini bisa langsung diformat jadi task block dengan acceptance criteria per halaman.
