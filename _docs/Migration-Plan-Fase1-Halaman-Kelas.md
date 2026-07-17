# Migration Plan — Fase 1 (Pilot): Halaman Kelas ke Next.js
## Eva Scolaro Talent Studio

---

## 1. Ruang Lingkup

Ini adalah **plan terpisah dan lebih kecil** dari migration plan penuh sebelumnya. Fokusnya **hanya 9 halaman kelas** yang sudah di-draft (`/classes/hip-hop/`, `/classes/ballet/`, `/classes/singing/`, `/classes/kpop-dance/`, `/classes/jazz-dance/`, `/classes/drama-musical-theatre/`, `/classes/modeling/`, `/classes/breakdance/`, `/classes/public-speaking/`).

**Yang TIDAK berubah di fase ini:**
- Homepage, Gallery, Practice, Dancewear, News, Contact, Terms & Conditions — **tetap 100% di WordPress/Elementor seperti sekarang**, tidak disentuh.
- WordPress tetap di domain utama (belum pindah ke `cms.` subdomain — itu baru terjadi kalau lanjut ke migrasi penuh nanti).
- Form Registration/Trial/Feedback — tetap seperti sekarang, tidak diubah.

**Yang berubah:**
- 9 URL `/classes/*` di-render oleh Next.js, sementara sisanya tetap dilayani WordPress — **kedua sistem hidup berdampingan di satu domain yang sama**, transparan bagi pengunjung.

**Kenapa mulai dari sini:**
- Risiko rendah — halaman baru (belum ada di situs live saat ini), jadi tidak ada downtime/redirect risk pada halaman existing.
- Validasi teknis Next.js + WP headless di skala kecil sebelum komit ke migrasi penuh.
- Halaman kelas adalah aset SEO baru yang bernilai (long-tail keyword per kelas) — cocok jadi pilot yang langsung memberi dampak bisnis.

---

## 2. Arsitektur: Coexistence Next.js + WordPress (Strangler Fig Pattern)

Karena WordPress tetap melayani domain utama, dibutuhkan mekanisme agar path `/classes/*` diarahkan ke Next.js sementara path lain tetap ke WordPress — semua di bawah domain yang sama (`www.evascolarotalentstudio.com`), tanpa terlihat pengunjung sebagai dua sistem berbeda.

**Pendekatan yang direkomendasikan: Vercel Rewrites (reverse proxy)**

```
Pengunjung → www.evascolarotalentstudio.com (DNS → Vercel)
                    │
      ┌─────────────┴──────────────┐
      ▼                             ▼
 path = /classes/*            path lainnya
      │                             │
 Next.js render               Vercel rewrite (proxy)
 (ISR dari WP API)             ke WordPress origin
                               (hosting saat ini, tidak berubah)
```

- DNS domain utama diarahkan ke Vercel.
- Di `next.config.js`, semua path SELAIN `/classes/*` di-**rewrite** (proxy transparan) ke server WordPress yang ada sekarang. Bagi pengunjung, URL di address bar tetap `www.evascolarotalentstudio.com/...` — mereka tidak akan sadar ada dua sistem di baliknya.
- Path `/classes/*` di-render native oleh Next.js.
- **Keuntungan:** tidak perlu migrasi apa pun di luar 9 halaman ini, WordPress berjalan seperti biasa, dan proses ini bisa "dibongkar" tanpa risiko kalau ternyata pilot tidak dilanjutkan ke migrasi penuh.

*(Alternatif jika tidak pakai Vercel: reverse proxy setara di level Nginx/Cloudflare Worker pada hosting yang menangani domain saat ini — prinsip sama.)*

---

## 3. Struktur Data / CMS

Isi dari draft konten yang sudah dibuat (`Draft-Konten-Halaman-Kelas-Eva-Scolaro.md`) dipakai langsung sebagai skema field. Tambahkan **Custom Post Type baru `Kelas`** di WordPress dengan ACF Field Group berikut:

| Field | Tipe ACF | Contoh dari draft |
|---|---|---|
| `slug` | Text/Slug (post slug) | `hip-hop` |
| `seo_title` | Text | "Kelas Hip-Hop untuk Anak di Bali (Sanur & Canggu)..." |
| `meta_description` | Textarea | "Kelas hip-hop untuk anak usia 4–16 tahun..." |
| `h1` | Text | "Kelas Hip-Hop untuk Anak di Sanur & Canggu" |
| `intro` | WYSIWYG/Textarea | Paragraf intro |
| `benefits` | Repeater (text) | List "Kenapa ikut kelas ini" |
| `age_groups` | Repeater (level, age_range, focus) | Tabel Tots/Junior/Teen |
| `schedule` | Repeater (location, day, class_name, time_start, time_end, coach) | Tabel jadwal per studio |
| `coaches_note` | Textarea | Paragraf "Coach: ..." |
| `price_note` | Text | "Mulai dari Rp110.000/kelas..." |
| `faq` | Repeater (question, answer) | Q&A |
| `cta_label` | Text | "Book Free Trial Class" |
| `status` | Select: `active` / `coming_soon` | Untuk kasus Public Speaking |
| `availability_note` | Textarea (kondisional, muncul jika `coming_soon`) | Catatan seperti di Breakdance/Public Speaking |

**Catatan penting soal jadwal (schedule):**
Draft menyarankan agar jadwal **tidak di-hardcode**, tapi ditarik dari sumber yang sama dengan section Timetable di homepage. Untuk fase pilot ini (belum migrasi homepage), ada 2 opsi realistis:

- **Opsi A (lebih cepat, direkomendasikan untuk pilot):** Field `schedule` diisi manual sebagai repeater langsung di tiap halaman `Kelas`. Tim admin update manual tiap pergantian term — sama seperti alur update timetable homepage sekarang, hanya beda tempat input.
- **Opsi B (lebih ideal jangka panjang):** Buat CPT terpisah `Jadwal Kelas` (dipakai bersama oleh homepage timetable & halaman kelas), lalu halaman kelas query & filter dari situ. Ini butuh effort lebih karena berarti section Timetable di homepage WP juga perlu disesuaikan strukturnya — **lebih cocok dikerjakan saat migrasi penuh**, bukan di fase pilot.

→ **Rekomendasi:** pakai **Opsi A** dulu untuk pilot ini, lalu konsolidasi ke Opsi B saat lanjut ke migrasi penuh (sudah tercakup di plan migrasi penuh, bagian Timetable).

---

## 4. Struktur Halaman & Kasus Khusus

| Halaman | Catatan implementasi |
|---|---|
| Hip-Hop, Ballet, Singing, K-Pop Dance, Jazz Dance, Drama & Musical Theatre, Modeling | Template standar: Hero → Intro → Benefits → Age Groups table → Schedule (tab Sanur/Canggu) → Coach → Harga → FAQ → CTA |
| **Breakdance** | Hanya tersedia di Canggu — template tetap sama, tapi section schedule cukup tampilkan 1 lokasi + catatan "kelas tambahan bisa dibuka di Sanur jika ada demand" (`availability_note`) |
| **Public Speaking** | `status = coming_soon` → sembunyikan section Schedule/Harga/FAQ penuh, tampilkan hanya catatan ketersediaan + CTA "Tanyakan Ketersediaan Kelas" |

⚠️ **Keputusan bisnis tertunda (dari draft, bagian Catatan Implementasi):** apakah Public Speaking dibuka untuk publik atau tetap eksklusif sekolah partner. Ini perlu diputuskan sebelum development dimulai — kalau tidak dibuka untuk publik, halaman ini bisa dikeluarkan dari 9 halaman fase 1 (jadi 8 halaman saja).

---

## 5. Desain & Komponen

Karena halaman ini hidup di domain yang sama dengan WordPress, **header dan footer harus identik** dengan yang tampil di situs existing, supaya transisi antar halaman (mis. dari homepage WP ke `/classes/hip-hop/`) terasa mulus tanpa "patah" secara visual.

- Bangun komponen `Header` & `Footer` di Next.js yang mereplikasi persis nav & footer Elementor saat ini (termasuk menu Home/Price/Timetable/Gallery/Practice/Dancewear/News, ikon sosial media, popup Join Us/Book Free Trial jika ingin tetap ada di halaman kelas).
- Popup "Book Free Trial" — untuk pilot ini, cukup **link CTA ke WhatsApp langsung** (`wa.me/6282146284464`) dengan pesan prefilled sesuai nama kelas, tanpa perlu rebuild form popup penuh (form popup dikerjakan saat migrasi penuh, sesuai plan sebelumnya dengan Resend).
- Styling: Tailwind CSS, dengan design tokens (warna `#dd3333`, font, spacing) diambil dari CSS Elementor existing agar konsisten.

---

## 6. SEO

- Setiap halaman render `<title>`, `<meta description>`, dan Open Graph tags dari field `seo_title` / `meta_description` (via `generateMetadata()` Next.js).
- Tambahkan structured data **Course** (schema.org) per halaman kelas — nilai tambah SEO yang belum ada di situs saat ini.
- Update `sitemap.xml` untuk include 9 URL baru ini.
- Karena ini halaman baru (bukan pengganti URL lama), **tidak ada risiko redirect/kehilangan ranking existing** — murni penambahan.
- Internal linking: tambahkan link dari homepage (section Timetable/pricing existing di WP) ke masing-masing halaman kelas terkait, supaya juice SEO mengalir & user experience nyambung.

---

## 7. Timeline Estimasi

| Fase | Aktivitas | Estimasi |
|---|---|---|
| 1. Setup | CPT `Kelas` + ACF fields di WP, setup Vercel + rewrite rule ke origin WP | 2–3 hari |
| 2. Input Konten | Migrasi 9 (atau 8) draft konten ke WP Admin | 1–2 hari (bisa paralel dgn dev) |
| 3. Development | Bangun template halaman kelas + Header/Footer + komponen schedule/FAQ | 4–6 hari |
| 4. Integrasi & Testing | Sambungkan ke WP API, test rewrite proxy, cek semua 9 halaman, cek mobile | 2–3 hari |
| 5. SEO & QA | Metadata, sitemap, internal linking dari homepage | 1–2 hari |
| 6. Review & Go-Live | Review tim, publish | 1–2 hari |

**Total estimasi: ± 2–2.5 minggu** — jauh lebih cepat dari migrasi penuh karena scope kecil dan tidak menyentuh halaman existing.

---

## 8. Risiko Khusus Fase Ini & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Rewrite/proxy salah konfigurasi → halaman WP existing ikut rusak/berubah | Testing menyeluruh di staging domain dulu sebelum arahkan DNS production |
| Jadwal di halaman kelas jadi tidak sinkron dengan section Timetable homepage (karena data manual terpisah — Opsi A) | Dokumentasikan SOP: setiap update jadwal term baru, update di 2 tempat (homepage WP & CPT Kelas) sampai nanti dikonsolidasi di migrasi penuh |
| Keputusan bisnis soal Public Speaking belum final saat development mulai | Sepakati dulu sebelum kickoff, atau kerjakan 8 halaman dulu dan tambahkan Public Speaking belakangan |
| Load Next.js baru menambah kompleksitas infra untuk tim yang belum terbiasa | Dokumentasi teknis ringkas + akses Vercel dashboard untuk monitoring, tidak perlu maintenance harian karena ISR otomatis |

---

## 9. Jalur ke Migrasi Penuh (Nanti)

Fase pilot ini dirancang agar **tidak jadi kerja buang-buang** kalau nanti lanjut ke migrasi penuh (sesuai plan sebelumnya):
- CPT `Kelas` + ACF yang dibuat di sini bisa langsung dipakai lagi, tinggal disambungkan ke CPT Timetable global (Opsi B) saat homepage juga dimigrasi.
- Setup Vercel + Next.js project yang sama tinggal di-extend untuk meng-cover halaman lain (Home, Gallery, dst.), bukan mulai dari nol.
- Header/Footer component yang dibangun di fase ini langsung reusable untuk seluruh situs.
- Rewrite proxy ke WordPress tinggal dikurangi bertahap (satu per satu path dipindah ke Next.js) sampai akhirnya WordPress sepenuhnya headless — persis pola "strangler fig" yang direkomendasikan untuk migrasi bertahap tanpa big-bang cutover.

---

*Dokumen ini melengkapi (bukan menggantikan) migration plan penuh sebelumnya — bisa dijalankan independen sebagai langkah awal sebelum keputusan migrasi penuh diambil.*
