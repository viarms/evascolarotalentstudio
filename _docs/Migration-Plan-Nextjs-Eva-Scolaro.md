# Migration Plan: WordPress → Next.js Frontend
## Eva Scolaro Talent Studio (evascolarotalentstudio.com)

---

## 0. Keputusan yang Sudah Difinalisasi

| Keputusan | Ketetapan |
|---|---|
| Lokasi WordPress | Subdomain **`cms.evascolarotalentstudio.com`** — tidak menerima traffic publik, khusus admin |
| Sistem form | **Resend** — semua submission (Registration, Book Free Trial, Feedback) dikirim ke alamat email recipient yang sama seperti sekarang |
| Dancewear | Tetap katalog informasi (foto/deskripsi + CTA "Order Now" ke WA), **tanpa keranjang/pembayaran** |
| Pengelola konten pasca-migrasi | Tim internal Eva Scolaro Studio sendiri lewat WP Admin |

Dokumen di bawah ini sudah disesuaikan dengan keputusan-keputusan tersebut.

---

## 1. Ringkasan & Tujuan

Migrasi frontend website dari **WordPress (Elementor)** ke **Next.js**, dengan WordPress tetap dipertahankan sebagai **headless CMS** (backend content management). Layout dan desain visual saat ini dipertahankan 1:1, hanya rendering engine-nya yang berubah.

**Tujuan utama:**
- Performa lebih cepat (Core Web Vitals, LCP, TTFB)
- SEO lebih terkontrol (server-side rendering / static generation)
- Keamanan lebih baik (attack surface WordPress frontend hilang)
- Tim non-teknis tetap bisa update konten lewat WP Admin seperti biasa
- Desain, branding, dan UX tidak berubah bagi pengunjung

**Arsitektur target:**
```
[ WordPress (headless, wp-admin only) ]
        │  REST API / WPGraphQL
        ▼
[ Next.js frontend (Vercel) ] ──▶ [ Pengunjung ]
```
WordPress tidak lagi merender halaman publik (`wp-content/themes` mati fungsinya), hanya berfungsi sebagai sumber data + admin panel.

---

## 2. Audit Situs Saat Ini

Berdasarkan pengecekan langsung ke situs:

| Aspek | Temuan |
|---|---|
| CMS/Builder | WordPress + Elementor (page builder), plugin `webp-uploads` |
| Halaman utama | Home, Gallery (Photo & Concerts Documentary), Practice, Dancewear, News/Announcement, Terms & Conditions, Contact |
| Konten dinamis | **Timetable/jadwal kelas** per lokasi studio (Sanur, Canggu, AIS School, Dyatmika School, Toki Hub) dan per hari — sangat terstruktur, cocok jadi Custom Post Type / ACF repeater |
| Pricing table | 3 paket harga (statis, jarang berubah) |
| Popup/Modal | 3 popup: **Registration**, **Book Free Trial**, **Feedback** — semua form dinamis (JS-based, Elementor Forms/WPForms-style), submit ke endpoint pihak ketiga (`fstdoservo.com`) |
| Galeri | Foto & dokumentasi konser |
| Dancewear | Halaman produk seperti katalog (kemungkinan WooCommerce atau custom post type sederhana) |
| News | Blog/announcement standar WordPress |
| Peta lokasi | 2 lokasi (Canggu & Sanur) dengan link Google Maps |
| Integrasi eksternal | Instagram, Facebook, YouTube, Spotify embed, WhatsApp CTA |
| SEO plugin | Ada (meta title/description/OG image ter-generate rapi — kemungkinan Yoast/RankMath) |

**Implikasi:** Fitur form dan timetable adalah bagian paling kompleks untuk dipindahkan — bukan sekadar "tampilkan teks", tapi butuh strategi data & submission.

---

## 3. Strategi Backend: WordPress Headless

1. **Pertahankan WordPress** sepenuhnya untuk:
   - Manajemen halaman/post (News/Announcement)
   - Media library (galeri foto, gambar timetable PDF/JPG)
   - Custom Post Types untuk: Timetable/Kelas, Dancewear item, Testimoni
2. **Install plugin API layer:**
   - **WPGraphQL** (direkomendasikan) — query fleksibel, efisien untuk data terstruktur seperti timetable
   - Alternatif lebih ringan: REST API bawaan WP + **ACF to REST API** plugin
3. **Advanced Custom Fields (ACF)** untuk membuat struktur data timetable (hari, jam, coach, kelas, lokasi) dan pricing, alih-alih hardcode di Elementor.
4. **WordPress dipindah ke subdomain `cms.evascolarotalentstudio.com`** (sudah diputuskan):
   - Domain utama `www.evascolarotalentstudio.com` sepenuhnya diarahkan ke Next.js (Vercel).
   - `cms.evascolarotalentstudio.com` hanya diakses tim internal untuk login wp-admin, input timetable, upload galeri, tulis News/Announcement, dsb.
   - Tidak perlu proxy/rewrite rumit karena domain publik dan admin sudah terpisah secara alami di level DNS.
   - Tambahkan proteksi ekstra di subdomain `cms.` (mis. batasi akses wp-admin via IP/Cloudflare Access, wajib 2FA) karena ini menjadi satu-satunya pintu masuk konten.
5. **Preview mode**: aktifkan WP preview → Next.js draft mode, supaya tim bisa lihat perubahan sebelum publish tanpa perlu redeploy.

---

## 4. Strategi Frontend: Next.js

### Stack yang direkomendasikan
- **Next.js 15 (App Router)**
- **Tailwind CSS** — untuk merekonstruksi styling Elementor secara presisi, lebih ringan dari CSS Elementor bawaan
- **TypeScript**
- Rendering: **ISR (Incremental Static Regeneration)** untuk Home, Gallery, Dancewear, News — di-revalidate tiap beberapa menit/jam sehingga update dari WP admin otomatis tampil tanpa perlu redeploy
- **next/image** untuk optimasi semua gambar (galeri, mascot, hero image) — dampak besar ke performa karena situs asli banyak gambar besar (.webp sudah dipakai, bagus)
- Hosting: **Vercel** (paling cocok untuk Next.js + ISR)

### Pemetaan halaman → route Next.js
| Halaman WP saat ini | Route Next.js | Rendering |
|---|---|---|
| Home (`/`) | `/` | ISR |
| Gallery → Photo | `/gallery` | ISR |
| Gallery → Concerts Documentary | `/concerts-documentary` | ISR |
| Practice | `/practice` | ISR |
| Dancewear | `/dancewear` | ISR |
| News/Announcement | `/announcement` + `/announcement/[slug]` | ISR |
| Terms & Conditions | `/terms-conditions` | Static |
| Contact | `/contact` | Static + Form client component |
| Timetable (section di Home) | Komponen di `/`, data dari CPT `timetable` | ISR |

### Rekonstruksi desain
- Ambil screenshot & inspect elemen tiap section (hero, pricing card, timetable tab, about, footer, popup forms) untuk memastikan replikasi piksel-presisi.
- Ekstrak design tokens: warna brand (`#dd3333` sebagai theme-color), font, spacing, border-radius dari CSS Elementor yang ada.
- Bangun komponen reusable: `Hero`, `PricingCard`, `TimetableTabs`, `GalleryGrid`, `PopupModal`, `RegistrationForm`, `Footer`, dst.

---

## 5. Strategi Form (Registration, Book Free Trial, Feedback)

Form saat ini submit ke endpoint pihak ketiga (`fstdoservo.com`). Untuk versi Next.js, form dibangun native dan pengiriman notifikasi memakai **Resend**.

**Implementasi:**
- 3 form (Registration, Book Free Trial, Feedback) dibangun sebagai komponen React di dalam popup modal, tampilan & field identik dengan yang sekarang (termasuk checkbox kelas, dropdown lokasi studio, terms & conditions).
- Validasi input pakai **React Hook Form + Zod** (nomor WA, email, field wajib, dsb).
- Setiap submit memanggil **API Route** Next.js (`/app/api/register`, `/app/api/trial`, `/app/api/feedback`).
- API Route menggunakan **Resend** untuk mengirim email notifikasi ke alamat recipient yang sama seperti yang dipakai saat ini (perlu konfirmasi alamat email tujuan yang aktif di sistem lama sebelum development, supaya tidak ada notifikasi yang "hilang" saat cutover).
- Email berisi seluruh data form dalam format rapi (nama orang tua, nama & usia anak, lokasi, kelas yang diminati, kontak WA).
- API key Resend disimpan sebagai environment variable di Vercel (tidak pernah terekspos ke client).
- Opsional: tambahkan auto-reply email ke pengisi form ("Terima kasih, tim kami akan menghubungi Anda") menggunakan template Resend.
- Testing wajib sebelum go-live: submit dari form Next.js → pastikan email masuk dengan benar, cek folder spam, dan verifikasi domain pengirim (SPF/DKIM) di Resend agar deliverability tinggi.

---

## 6. Timetable — Perlakuan Khusus

Data timetable saat ini sangat terstruktur (lokasi → hari → kelas → coach → jam). Rencana:
1. Buat **Custom Post Type `class_schedule`** di WordPress dengan ACF fields: `location`, `day`, `class_name`, `coach`, `start_time`, `end_time`.
2. Tim studio input/edit jadwal lewat WP Admin (form biasa, tanpa perlu sentuh kode).
3. Next.js fetch data ini lewat GraphQL, render dengan komponen tab interaktif (lokasi & hari) yang meniru UX tab yang sudah ada sekarang.
4. Kalender tahunan (gambar JPG/PDF) tetap upload biasa lewat WP Media Library.

---

## 7. SEO & Redirect Preservation

- Audit seluruh URL existing (`/gallery/`, `/dancewear/`, `/practice/`, `/announcement/`, `/terms-conditions/`, `/contact/`) → pastikan struktur URL Next.js **identik** agar tidak kehilangan ranking.
- Pindahkan meta title/description/OG image per halaman dari plugin SEO WP (Yoast/RankMath) → generate otomatis di Next.js pakai `generateMetadata()`, tetap ambil datanya dari field SEO di WP lewat API.
- Setup `sitemap.xml` & `robots.txt` baru di Next.js.
- Pasang **301 redirect** untuk URL lama yang berubah (jika ada).
- Submit ulang sitemap ke Google Search Console setelah go-live, pantau index & traffic 2–4 minggu pertama.

---

## 8. Fase Migrasi & Timeline (Estimasi)

| Fase | Aktivitas | Estimasi Waktu |
|---|---|---|
| 1. Discovery & Setup | Audit detail semua halaman/komponen, setup WPGraphQL + ACF, setup repo Next.js, design token extraction | 1 minggu |
| 2. CMS Restructuring | Buat CPT Timetable, Dancewear, Testimoni; migrasi konten existing ke field terstruktur | 1–2 minggu |
| 3. Build Core Pages | Home, Gallery, Practice, Dancewear, News, Contact, Terms | 2–3 minggu |
| 4. Forms & Integrations | Registration, Book Trial, Feedback + notifikasi WA/email | 1 minggu |
| 5. SEO & Redirect | Metadata, sitemap, testing redirect | 3–4 hari |
| 6. QA & Cross-device Testing | Perbandingan visual dengan situs lama, testing mobile/tablet/desktop, form testing | 1 minggu |
| 7. Staging & Client Review | Review bersama tim Eva Scolaro Studio, revisi | 3–5 hari |
| 8. Go-Live | Deploy production, DNS cutover, monitoring | 1–2 hari |

**Total estimasi: ± 6–8 minggu** (tergantung kompleksitas dancewear/e-commerce dan integrasi notifikasi).

---

## 9. Hosting & Infrastruktur

| Komponen | Rekomendasi |
|---|---|
| Frontend Next.js | Vercel (auto-deploy dari Git, ISR native, image optimization) |
| WordPress backend | Tetap di hosting saat ini, atau pindah ke managed WP hosting (mis. WP Engine/Kinsta) khusus subdomain `cms.` |
| Domain | `www.evascolarotalentstudio.com` → Vercel (Next.js); `cms.evascolarotalentstudio.com` → WordPress (admin only, sudah diputuskan) |
| Email notifikasi | Resend (domain `evascolarotalentstudio.com` diverifikasi di Resend untuk SPF/DKIM) |
| CDN/Image | Otomatis via Vercel + `next/image`, opsional tambahan Cloudflare di depan `cms.` untuk keamanan wp-admin |

---

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Tim internal kesulitan input data terstruktur (ACF) di subdomain `cms.` baru | Buat panduan singkat/video tutorial WP Admin sebagai bagian dari handover |
| Email notifikasi dari Resend masuk spam atau tidak sampai ke recipient | Verifikasi domain (SPF/DKIM) di Resend sebelum go-live, uji kirim ke semua alamat recipient yang dipakai |
| Kehilangan traffic SEO saat cutover | Preservasi struktur URL & redirect, submit sitemap ulang, pantau GSC ketat |
| Perbedaan visual dengan desain asli | Review piksel-presisi sebelum go-live, checklist per halaman |
| Downtime saat DNS cutover | Lakukan di luar jam sibuk, siapkan rollback plan |

---

## 11. Langkah Selanjutnya

Dengan semua keputusan kunci sudah difinalisasi, langkah berikutnya:

1. Setup subdomain `cms.evascolarotalentstudio.com` (DNS + hosting WP di sana) dan proteksi aksesnya.
2. Kumpulkan alamat email recipient aktif yang saat ini menerima notifikasi dari form Registration/Trial/Feedback, untuk dikonfigurasi di Resend.
3. Susun dokumen teknis detail: skema ACF untuk Timetable & Dancewear, wireframe komponen, daftar environment variable.
4. Siapkan akses awal: repo Git untuk Next.js, akun Vercel, akun Resend, kredensial WP Admin di subdomain baru.
5. Karena tim internal yang akan mengelola konten pasca-migrasi, siapkan dokumentasi/SOP singkat (cara input timetable, upload galeri, publish News) sebagai bagian dari deliverable akhir proyek.

---

*Dokumen ini adalah rencana awal (high-level). Setelah disepakati, langkah berikutnya adalah membuat dokumen teknis detail (arsitektur API, skema ACF, wireframe komponen) sebelum development dimulai.*
