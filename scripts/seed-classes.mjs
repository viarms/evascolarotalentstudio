#!/usr/bin/env node
/**
 * scripts/seed-classes.mjs
 *
 * Pushes all 9 class entries to WordPress via REST API + ACF.
 *
 * Prerequisites on WordPress:
 *  - Custom Post Type registered with slug "class"
 *    (graphql_single_name: "class", graphql_plural_name: "classes")
 *  - ACF field group "classFields" attached to the "class" CPT
 *  - WPGraphQL + ACF to WPGraphQL plugins active
 *  - Application Password created for your admin user (WP Admin → Users → Edit → Application Passwords)
 *
 * Usage:
 *   cp .env.local.example .env.local   # fill in credentials
 *   npm run seed:classes
 *
 * The script is idempotent: it checks for an existing post by slug and
 * updates it rather than creating a duplicate.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ─── Load .env.local manually (no dotenv dependency needed) ──────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env.local");

try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.error("⚠️  .env.local not found — set WP_ORIGIN, WP_ADMIN_USER, WP_ADMIN_PASS as env vars.");
}

const WP_ORIGIN = process.env.WP_ORIGIN?.replace(/\/$/, "");
const WP_USER   = process.env.WP_ADMIN_USER;
const WP_PASS   = process.env.WP_ADMIN_PASS; // Application Password (spaces OK)

if (!WP_ORIGIN || !WP_USER || !WP_PASS) {
  console.error("Missing env vars: WP_ORIGIN, WP_ADMIN_USER, WP_ADMIN_PASS");
  process.exit(1);
}

const AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const HEADERS = {
  "Authorization": `Basic ${AUTH}`,
  "Content-Type":  "application/json",
};


// ─── Helper ──────────────────────────────────────────────────────────────────

async function wpFetch(path, options = {}) {
  const res = await fetch(`${WP_ORIGIN}/wp-json${path}`, {
    ...options,
    headers: { ...HEADERS, ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WP API ${options.method ?? "GET"} ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

/** Find existing post by slug; returns post ID or null. */
async function findBySlug(slug) {
  const results = await wpFetch(`/wp/v2/class?slug=${encodeURIComponent(slug)}&_fields=id,slug`);
  return results.length > 0 ? results[0].id : null;
}

/** Create or update a class post. ACF fields go in the `acf` key. */
async function upsertClass(entry) {
  const { slug, title, acf } = entry;
  const existingId = await findBySlug(slug);

  const body = JSON.stringify({ title, slug, status: "publish", acf });

  if (existingId) {
    await wpFetch(`/wp/v2/class/${existingId}`, { method: "POST", body });
    console.log(`  ✔  updated  → ${slug}  (id ${existingId})`);
  } else {
    const created = await wpFetch("/wp/v2/class", { method: "POST", body });
    console.log(`  ✔  created  → ${slug}  (id ${created.id})`);
  }
}


// ─── Class data ───────────────────────────────────────────────────────────────

const CLASSES = [

  // ── 1. Hip-Hop ──────────────────────────────────────────────────────────────
  {
    slug:  "hip-hop",
    title: "Hip-Hop",
    acf: {
      seoTitle:        "Kelas Hip-Hop untuk Anak di Bali (Sanur & Canggu) | Eva Scolaro Talent Studio",
      metaDescription: "Kelas hip-hop untuk anak usia 4–16 tahun di Sanur & Canggu. Coach berpengalaman, kelas Tots/Junior/Teen. Trial gratis, tanpa biaya pendaftaran!",
      h1:    "Kelas Hip-Hop untuk Anak di Sanur & Canggu",
      intro: "Hip-hop adalah salah satu kelas paling diminati di Eva Scolaro Talent Studio. Anak-anak belajar koreografi energik, ritme musik, dan gaya urban dance dalam suasana yang seru dan suportif — cocok untuk yang baru mulai maupun yang sudah percaya diri di atas panggung.",
      benefits: [
        { item: "Membangun koordinasi, ritme, dan kekuatan fisik" },
        { item: "Meningkatkan rasa percaya diri lewat penampilan panggung tiap akhir term" },
        { item: "Kelas dipisah per kelompok usia agar materi sesuai kemampuan" },
        { item: "Bagian dari konser tahunan studio" },
      ],
      ageGroups: [
        { level: "Tots",   ageRange: "3–5 tahun",   focus: "Pengenalan gerak dasar, ritme, kepercayaan diri di depan cermin" },
        { level: "Junior", ageRange: "6–9 tahun",   focus: "Koreografi lebih kompleks, kerja sama tim" },
        { level: "Teen",   ageRange: "10–16 tahun", focus: "Teknik lanjutan, gaya personal, persiapan performance" },
      ],
      schedule: [
        {
          location: "sanur",
          items: [
            { day: "Senin", className: "Tots Hip-Hop",   timeStart: "14:30", timeEnd: "15:15", coach: "Novie" },
            { day: "Senin", className: "Junior Hip-Hop", timeStart: "15:30", timeEnd: "16:30", coach: "Novie" },
            { day: "Senin", className: "Teen Hip-Hop",   timeStart: "16:30", timeEnd: "17:30", coach: "Novie" },
            { day: "Kamis", className: "Tots Hip-Hop",   timeStart: "14:30", timeEnd: "15:15", coach: "Faith" },
            { day: "Kamis", className: "Junior Hip-Hop", timeStart: "15:30", timeEnd: "16:30", coach: "Faith" },
            { day: "Kamis", className: "Teen Hip-Hop",   timeStart: "16:30", timeEnd: "17:30", coach: "Faith" },
          ],
        },
        {
          location: "canggu",
          items: [
            { day: "Selasa", className: "Tots Hip-Hop",         timeStart: "15:30", timeEnd: "16:15", coach: "Tya" },
            { day: "Rabu",   className: "Junior Hip-Hop",       timeStart: "15:30", timeEnd: "16:30", coach: "Novie" },
            { day: "Rabu",   className: "Junior/Teen Hip-Hop",  timeStart: "16:30", timeEnd: "17:30", coach: "Novie" },
            { day: "Kamis",  className: "Tots Hip-Hop",         timeStart: "15:30", timeEnd: "16:15", coach: "Tya" },
            { day: "Sabtu",  className: "Tots Hip-Hop",         timeStart: "12:00", timeEnd: "12:45", coach: "Faith" },
          ],
        },
      ],
      coachesNote: "Novie, Faith, Tya — coach hip-hop kami memiliki pengalaman mengajar anak lintas usia dan rutin melatih koreografi konser akhir term.",
      priceNote:   "Mulai dari Rp110.000/kelas (paket 30 kelas/3 style). Lihat halaman pricing untuk semua opsi paket.",
      faq: [
        { question: "Apakah anak perlu pengalaman dance sebelumnya?",  answer: "Tidak, kelas Tots & Junior dirancang untuk pemula." },
        { question: "Kostum apa yang dibutuhkan?",                     answer: "Seragam kaos studio (termasuk dalam paket); kostum konser terpisah (+Rp200.000/kelas saat term concert)." },
        { question: "Bisa coba kelas dulu sebelum daftar?",            answer: "Bisa, kami sediakan trial class gratis tanpa biaya pendaftaran." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },


  // ── 2. Ballet ───────────────────────────────────────────────────────────────
  {
    slug:  "ballet",
    title: "Ballet",
    acf: {
      seoTitle:        "Kelas Ballet Anak di Bali — Sanur & Canggu | Eva Scolaro Talent Studio",
      metaDescription: "Kelas ballet untuk anak usia 3+ di Sanur & Canggu, dibimbing coach berpengalaman. Kelas Tots hingga Junior/Teen. Daftar trial gratis sekarang!",
      h1:    "Kelas Ballet untuk Anak di Sanur & Canggu",
      intro: "Kelas ballet kami memperkenalkan dasar-dasar teknik klasik dengan cara yang menyenangkan — membangun postur, kelenturan, disiplin, dan keanggunan gerak sejak usia dini.",
      benefits: [
        { item: "Fondasi teknik dance yang kuat untuk gaya apa pun ke depannya" },
        { item: "Melatih postur tubuh, kelenturan, dan disiplin" },
        { item: "Suasana kelas lembut dan suportif untuk anak usia dini" },
        { item: "Kesempatan tampil di konser akhir term dengan kostum tutu" },
      ],
      ageGroups: [
        { level: "Tots",        ageRange: "3–5 tahun",   focus: "Gerak dasar, kelenturan, mendengarkan musik" },
        { level: "Junior/Teen", ageRange: "6–16 tahun",  focus: "Teknik posisi kaki & tangan, kombinasi gerak, ekspresi" },
      ],
      schedule: [
        {
          location: "sanur",
          items: [
            { day: "Selasa", className: "Tots Ballet 1",      timeStart: "15:00", timeEnd: "15:45", coach: "Vivian" },
            { day: "Selasa", className: "Tots Ballet 2",      timeStart: "15:45", timeEnd: "16:30", coach: "Vivian" },
            { day: "Selasa", className: "Junior/Teen Ballet", timeStart: "16:30", timeEnd: "17:30", coach: "Vivian" },
          ],
        },
        {
          location: "canggu",
          items: [
            { day: "Jumat", className: "Tots Ballet",   timeStart: "15:30", timeEnd: "16:15", coach: "Rahma" },
            { day: "Jumat", className: "Junior Ballet", timeStart: "16:15", timeEnd: "17:15", coach: "Rahma" },
            { day: "Sabtu", className: "Tots Ballet",   timeStart: "10:00", timeEnd: "10:45", coach: "Rahma" },
            { day: "Sabtu", className: "Junior Ballet", timeStart: "11:00", timeEnd: "12:00", coach: "Rahma" },
          ],
        },
      ],
      coachesNote: "Vivian (Sanur), Rahma (Canggu) — fokus pada teknik dasar ballet yang aman dan sesuai tahap tumbuh kembang anak.",
      priceNote:   "Mulai dari Rp110.000/kelas — paket termasuk opsi seragam Tutu Ballet.",
      faq: [
        { question: "Usia berapa anak bisa mulai ballet?", answer: "Kelas Tots menerima anak mulai usia sekitar 3 tahun." },
        { question: "Perlu sepatu ballet khusus?",         answer: "Ya, disarankan; detail dapat ditanyakan saat trial class." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },


  // ── 3. Singing ──────────────────────────────────────────────────────────────
  {
    slug:  "singing",
    title: "Singing",
    acf: {
      seoTitle:        "Kelas Vokal / Singing untuk Anak di Bali | Eva Scolaro Talent Studio",
      metaDescription: "Kelas singing untuk anak & remaja di Sanur & Canggu. Latihan vokal, teknik bernyanyi, dan panggung konser akhir term. Trial gratis!",
      h1:    "Kelas Singing (Vokal) untuk Anak di Sanur & Canggu",
      intro: "Kelas singing membantu anak menemukan suara mereka — secara harfiah maupun kiasan. Dari teknik pernapasan dasar hingga penampilan solo di atas panggung, anak belajar bernyanyi dengan percaya diri.",
      benefits: [
        { item: "Melatih teknik vokal dasar (pernapasan, pitch, kontrol suara)" },
        { item: "Membangun kepercayaan diri tampil solo maupun grup" },
        { item: "Cocok untuk anak yang suka menyanyi maupun yang ingin lebih berani tampil" },
        { item: "Tampil di konser akhir term studio" },
      ],
      ageGroups: [
        { level: "Tots",   ageRange: "3–5 tahun",   focus: "Pengenalan nada, bernyanyi bersama, keberanian tampil" },
        { level: "Junior", ageRange: "6–9 tahun",   focus: "Teknik vokal dasar, latihan lagu sederhana" },
        { level: "Teen",   ageRange: "10–16 tahun", focus: "Kontrol vokal lanjutan, persiapan solo performance" },
      ],
      schedule: [
        {
          location: "sanur",
          items: [
            { day: "Jumat", className: "Tots Singing",   timeStart: "14:30", timeEnd: "15:15", coach: "Kuna" },
            { day: "Jumat", className: "Junior Singing", timeStart: "15:30", timeEnd: "16:30", coach: "Kuna" },
            { day: "Jumat", className: "Teen Singing",   timeStart: "16:30", timeEnd: "17:30", coach: "Kuna" },
          ],
        },
        {
          location: "canggu",
          items: [
            { day: "Senin", className: "Tots Singing 1",  timeStart: "15:15", timeEnd: "16:00", coach: "Kuna" },
            { day: "Senin", className: "Tots Singing 2",  timeStart: "16:00", timeEnd: "16:45", coach: "Kuna" },
            { day: "Senin", className: "Junior Singing",  timeStart: "16:45", timeEnd: "17:45", coach: "Kuna" },
            { day: "Senin", className: "Teen Singing",    timeStart: "17:45", timeEnd: "18:45", coach: "Andini" },
          ],
        },
      ],
      coachesNote: "Kuna, Andini — mengajar teknik vokal dasar hingga persiapan performance panggung.",
      priceNote:   "Mulai dari Rp110.000/kelas.",
      faq: [
        { question: "Anak saya belum pernah les vokal, apakah bisa ikut?", answer: "Bisa, kelas Tots & Junior dirancang untuk pemula total." },
        { question: "Apakah ada penampilan solo?",                         answer: "Ada kesempatan tampil solo/grup saat konser akhir term." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },


  // ── 4. K-Pop Dance ──────────────────────────────────────────────────────────
  {
    slug:  "kpop-dance",
    title: "K-Pop Dance",
    acf: {
      seoTitle:        "Kelas K-Pop Dance untuk Anak & Remaja di Bali | Eva Scolaro Talent Studio",
      metaDescription: "Kelas K-Pop dance untuk anak & remaja di Sanur & Canggu. Koreografi trending, kelas Junior & Teen. Daftar trial gratis sekarang!",
      h1:    "Kelas K-Pop Dance untuk Anak & Remaja di Sanur & Canggu",
      intro: "Kelas favorit para penggemar K-Pop! Anak-anak dan remaja belajar koreografi bergaya K-Pop terkini, melatih stamina, kekompakan tim, dan gaya panggung ala idol.",
      benefits: [
        { item: "Koreografi mengikuti tren lagu K-Pop terkini" },
        { item: "Melatih stamina, kekompakan formasi, dan gaya panggung" },
        { item: "Sangat diminati anak usia sekolah dasar hingga remaja" },
        { item: "Tampil grup di konser akhir term" },
      ],
      ageGroups: [
        { level: "Junior", ageRange: "6–9 tahun",   focus: "Gerakan dasar formasi, mengikuti irama lagu K-Pop" },
        { level: "Teen",   ageRange: "10–16 tahun", focus: "Koreografi kompleks, ekspresi panggung ala idol" },
      ],
      schedule: [
        {
          location: "sanur",
          items: [
            { day: "Senin", className: "Junior K-Pop", timeStart: "16:30", timeEnd: "17:30", coach: "Faith" },
            { day: "Senin", className: "Teen K-Pop",   timeStart: "17:30", timeEnd: "18:30", coach: "Faith" },
          ],
        },
        {
          location: "canggu",
          items: [
            { day: "Selasa", className: "K-Pop Dance", timeStart: "17:30", timeEnd: "18:30", coach: "Faith" },
          ],
        },
      ],
      coachesNote: "Faith — mengikuti perkembangan koreografi K-Pop terkini agar materi selalu relevan dengan tren yang disukai anak-anak.",
      priceNote:   "Mulai dari Rp110.000/kelas.",
      faq: [
        { question: "Apakah harus suka K-Pop dulu untuk ikut kelas ini?",    answer: "Tidak wajib, tapi memang paling seru untuk anak yang sudah suka lagu-lagu K-Pop." },
        { question: "Apakah ada kelas khusus untuk Tots (balita)?",          answer: "Saat ini K-Pop Dance dibuka mulai level Junior; hubungi kami via WhatsApp untuk cek ketersediaan kelas Tots K-Pop di term berjalan." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 5. Jazz Dance ───────────────────────────────────────────────────────────
  {
    slug:  "jazz-dance",
    title: "Jazz Dance",
    acf: {
      seoTitle:        "Kelas Jazz Dance untuk Anak di Bali | Eva Scolaro Talent Studio",
      metaDescription: "Kelas jazz dance untuk anak di Sanur & Canggu. Melatih ekspresi, teknik, dan kepercayaan diri di atas panggung. Trial gratis, tanpa biaya daftar.",
      h1:    "Kelas Jazz Dance untuk Anak di Sanur & Canggu",
      intro: "Jazz dance memadukan teknik, musikalitas, dan ekspresi diri. Kelas ini cocok untuk anak yang senang bergerak dinamis dan ingin mengeksplorasi gaya dance yang lebih ekspresif.",
      benefits: [
        { item: "Melatih fleksibilitas, kekuatan inti, dan musikalitas" },
        { item: "Gaya dance yang ekspresif dan menyenangkan" },
        { item: "Fondasi baik untuk anak yang tertarik musical theatre" },
        { item: "Tampil di konser akhir term" },
      ],
      ageGroups: [
        { level: "Tots",   ageRange: "3–5 tahun", focus: "Gerak dasar, ekspresi wajah & tubuh" },
        { level: "Junior", ageRange: "6–9 tahun", focus: "Kombinasi gerak, teknik dasar jazz" },
      ],
      schedule: [
        {
          location: "sanur",
          items: [
            { day: "Rabu", className: "Tots Jazz Dance",   timeStart: "15:00", timeEnd: "15:45", coach: "Putri" },
            { day: "Rabu", className: "Junior Jazz Dance", timeStart: "15:45", timeEnd: "16:45", coach: "Putri" },
          ],
        },
        {
          location: "canggu",
          items: [
            { day: "Selasa", className: "Jazz Dance", timeStart: "16:15", timeEnd: "17:15", coach: "Putri" },
          ],
        },
      ],
      coachesNote: "Putri — membawa gaya jazz yang energik dan mudah diikuti anak-anak.",
      priceNote:   "Mulai dari Rp110.000/kelas.",
      faq: [
        { question: "Apa beda Jazz Dance dengan Hip-Hop?", answer: "Jazz lebih menekankan teknik, musikalitas, dan ekspresi tubuh; Hip-Hop lebih ke ritme urban dan gaya bebas." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },


  // ── 6. Drama & Musical Theatre ──────────────────────────────────────────────
  {
    slug:  "drama-musical-theatre",
    title: "Drama & Musical Theatre",
    acf: {
      seoTitle:        "Kelas Drama & Musical Theatre untuk Anak di Bali | Eva Scolaro Talent Studio",
      metaDescription: "Kelas drama & musical theatre untuk anak dan remaja di Sanur & Canggu. Melatih akting, ekspresi, dan kepercayaan diri panggung. Trial gratis!",
      h1:    "Kelas Drama & Musical Theatre untuk Anak di Sanur & Canggu",
      intro: "Kelas ini memadukan seni peran (drama) dan pertunjukan musikal, membantu anak mengekspresikan diri, membangun empati lewat karakter, dan tampil percaya diri di depan penonton.",
      benefits: [
        { item: "Melatih ekspresi, olah vokal, dan gerak tubuh sekaligus" },
        { item: "Membangun kepercayaan diri bicara & tampil di depan umum" },
        { item: "Mengembangkan imajinasi dan kemampuan bercerita" },
        { item: "Persiapan pertunjukan musikal di konser akhir term" },
      ],
      ageGroups: [
        { level: "Junior", ageRange: "6–9 tahun",   focus: "Latihan akting dasar, permainan peran" },
        { level: "Teen",   ageRange: "10–16 tahun", focus: "Musical theatre, akting karakter, olah vokal untuk panggung" },
      ],
      schedule: [
        {
          location: "sanur",
          items: [
            { day: "Rabu",  className: "Teen Drama",   timeStart: "16:45", timeEnd: "17:45", coach: "Andini" },
            { day: "Kamis", className: "Junior Drama", timeStart: "16:30", timeEnd: "17:30", coach: "Andini" },
          ],
        },
        {
          location: "canggu",
          items: [
            { day: "Kamis", className: "Musical Theatre",     timeStart: "16:15", timeEnd: "17:15", coach: "Putri" },
            { day: "Jumat", className: "Junior/Teen Drama",   timeStart: "17:30", timeEnd: "18:30", coach: "Andini" },
          ],
        },
      ],
      coachesNote: "Andini, Putri — berpengalaman membimbing anak dalam olah peran dan musical theatre untuk pertunjukan panggung.",
      priceNote:   "Mulai dari Rp110.000/kelas.",
      faq: [
        { question: "Apakah anak pemalu bisa ikut kelas ini?",    answer: "Justru kelas ini dirancang untuk membantu anak yang pemalu membangun kepercayaan diri secara bertahap." },
        { question: "Apa bedanya Drama dan Musical Theatre?",     answer: "Drama fokus ke akting & dialog; Musical Theatre menggabungkan akting, nyanyi, dan gerak/dance dalam satu pertunjukan." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 7. Modeling ─────────────────────────────────────────────────────────────
  {
    slug:  "modeling",
    title: "Modeling",
    acf: {
      seoTitle:        "Kelas Modeling untuk Anak & Remaja di Bali | Eva Scolaro Talent Studio",
      metaDescription: "Kelas modeling untuk anak & remaja di Sanur & Canggu. Melatih catwalk, posture, dan kepercayaan diri di depan kamera. Trial gratis!",
      h1:    "Kelas Modeling untuk Anak & Remaja di Sanur & Canggu",
      intro: "Kelas modeling melatih anak dan remaja tentang postur tubuh, teknik catwalk, dan kepercayaan diri di depan kamera maupun panggung — dasar yang berguna jauh melampaui dunia modeling itu sendiri.",
      benefits: [
        { item: "Melatih postur tubuh dan cara berjalan yang percaya diri" },
        { item: "Membangun kenyamanan tampil di depan kamera/panggung" },
        { item: "Melatih ekspresi wajah dan bahasa tubuh" },
        { item: "Kesempatan tampil di konser & sesi foto/dokumentasi studio" },
      ],
      ageGroups: [
        { level: "Tots/Junior", ageRange: "3–9 tahun",   focus: "Pengenalan postur, jalan dasar, percaya diri di depan orang lain" },
        { level: "Teen",        ageRange: "10–16 tahun", focus: "Teknik catwalk, pose, ekspresi kamera" },
      ],
      schedule: [
        {
          location: "sanur",
          items: [
            { day: "Jumat", className: "Teen Modeling",        timeStart: "15:30", timeEnd: "16:30", coach: "Cintya" },
            { day: "Jumat", className: "Junior/Tots Modeling", timeStart: "16:30", timeEnd: "17:30", coach: "Cintya" },
          ],
        },
        {
          location: "canggu",
          items: [
            { day: "Kamis", className: "Tots Modeling",        timeStart: "14:30", timeEnd: "15:15", coach: "Cintya" },
            { day: "Kamis", className: "Junior/Teen Modeling", timeStart: "17:30", timeEnd: "18:30", coach: "Cintya" },
          ],
        },
      ],
      coachesNote: "Cintya — membimbing dasar-dasar modeling yang sesuai usia, dengan penekanan pada kepercayaan diri, bukan tekanan penampilan.",
      priceNote:   "Mulai dari Rp110.000/kelas.",
      faq: [
        { question: "Apakah kelas ini menjamin anak jadi model profesional?", answer: "Tujuan utama kelas adalah membangun rasa percaya diri dan postur yang baik — bukan janji karier modeling." },
        { question: "Apakah ada sesi foto?",                                  answer: "Studio mendokumentasikan momen pertunjukan & kegiatan; untuk sesi foto formal, tanyakan detail lebih lanjut via WhatsApp." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },


  // ── 8. Breakdance ───────────────────────────────────────────────────────────
  {
    slug:  "breakdance",
    title: "Breakdance",
    acf: {
      seoTitle:        "Kelas Breakdance untuk Anak & Remaja di Bali | Eva Scolaro Talent Studio",
      metaDescription: "Kelas breakdance untuk anak & remaja di Canggu. Melatih kekuatan, kelincahan, dan gaya freestyle. Trial gratis, tanpa biaya pendaftaran!",
      h1:    "Kelas Breakdance untuk Anak & Remaja di Canggu",
      intro: "Kelas breakdance mengenalkan gerakan dasar breaking — dari footwork hingga freeze — dalam suasana yang aman dan terstruktur, membangun kekuatan fisik sekaligus gaya personal.",
      benefits: [
        { item: "Melatih kekuatan otot, kelincahan, dan keseimbangan" },
        { item: "Mengembangkan gaya freestyle dan kepercayaan diri personal" },
        { item: "Cocok untuk anak yang energik dan suka tantangan fisik" },
        { item: "Tampil di konser akhir term" },
      ],
      ageGroups: [
        { level: "Junior/Teen", ageRange: "6–16 tahun", focus: "Gerakan dasar breaking, footwork, freeze, freestyle" },
      ],
      schedule: [
        {
          location: "canggu",
          items: [
            { day: "Sabtu", className: "Junior/Teen Breakdance", timeStart: "13:00", timeEnd: "14:00", coach: "Faith" },
          ],
        },
      ],
      coachesNote: "Faith.",
      priceNote:   "Mulai dari Rp110.000/kelas. Saat ini Breakdance hanya tersedia di Canggu Studio. Untuk peminat di Sanur, hubungi kami via WhatsApp.",
      faq: [
        { question: "Apakah anak perlu kelenturan khusus sebelum ikut?", answer: "Tidak, kelas dimulai dari gerakan dasar dan berkembang bertahap sesuai kemampuan anak." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 9. Public Speaking ──────────────────────────────────────────────────────
  {
    slug:  "public-speaking",
    title: "Public Speaking",
    acf: {
      seoTitle:        "Kelas Public Speaking untuk Remaja di Bali | Eva Scolaro Talent Studio",
      metaDescription: "Kelas public speaking untuk remaja — melatih kepercayaan diri bicara di depan umum. Bagian dari program performing arts Eva Scolaro Talent Studio.",
      h1:    "Kelas Public Speaking untuk Remaja",
      intro: "Kelas public speaking membantu remaja membangun kepercayaan diri berbicara di depan umum — keterampilan yang bermanfaat jauh melampaui panggung, mulai dari presentasi sekolah hingga kehidupan sehari-hari.",
      benefits: [
        { item: "Melatih struktur bicara, intonasi, dan bahasa tubuh" },
        { item: "Mengurangi rasa gugup tampil di depan umum" },
        { item: "Melengkapi kemampuan performing arts lain (drama, modeling)" },
      ],
      ageGroups: [
        { level: "Teen", ageRange: "10–16 tahun", focus: "Struktur bicara, intonasi, kepercayaan diri berbicara di depan umum" },
      ],
      schedule:    [],
      coachesNote: "Andini.",
      priceNote:   "",
      faq:         [],
      ctaLabel:        "Tanyakan Ketersediaan Kelas",
      status:          "coming_soon",
      availabilityNote: "Kelas Public Speaking saat ini berjalan sebagai program ECA khusus di sekolah partner kami. Untuk pendaftaran umum di Sanur atau Canggu Studio, silakan hubungi kami via WhatsApp — kami akan menginformasikan jadwal begitu kelas reguler dibuka untuk publik.",
    },
  },

]; // end CLASSES


// ─── Runner ──────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀  Seeding ${CLASSES.length} classes → ${WP_ORIGIN}\n`);

  // Verify we can reach the WP REST API before touching any data
  try {
    await wpFetch("/wp/v2/types/class?_fields=slug");
  } catch (err) {
    console.error(`\n❌  Cannot reach WP REST API or "class" CPT not found.\n   ${err.message}`);
    console.error(`\n   Make sure:\n   1. The "class" Custom Post Type is registered in WordPress\n   2. "show_in_rest: true" is set on the CPT registration\n   3. WP_ORIGIN is correct and the site is reachable\n`);
    process.exit(1);
  }

  let ok = 0;
  let failed = 0;

  for (const entry of CLASSES) {
    try {
      await upsertClass(entry);
      ok++;
    } catch (err) {
      console.error(`  ✗  FAILED  → ${entry.slug}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✅  Done — ${ok} succeeded, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

main();
