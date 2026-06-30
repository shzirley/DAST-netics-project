# ADVISE — Detailed UX Flow & Figma Implementation Plan
## DAST SaaS MVP untuk Software House, QA Engineer, dan Junior Developer Indonesia

---

## 1. Ringkasan & Tujuan Dokumen

Brainstorm awal ADVISE mendefinisikan 4 layar inti (RapidScan Gateway, Risk Radar Dashboard, Actionable Insights Panel, Compliance-Ready Exporter). Dokumen ini memperdalam keempatnya sekaligus melengkapi seluruh layar pendukung — autentikasi, manajemen target, kolaborasi tim, billing lokal, integrasi CI/CD, hingga edge state — agar MVP yang dieksekusi di Figma konsisten secara sistem desain dan lengkap secara fungsi.

Total: **25 layar** dalam **7 modul**.

---

## 2. Design System Foundation

Buat sebagai Color Styles & Text Styles di Figma **sebelum** mendesain layar apapun.

### 2.1 Palet Warna

| Token | Hex | Penggunaan |
|---|---|---|
| Primary / Dark Navy | `#111844` | Sidebar, teks utama di atas latar terang, heading penting |
| Secondary / Indigo | `#4B5694` | Tombol primer, state aktif, link interaktif |
| Tertiary / Steel Blue | `#7288AE` | Border, teks sekunder, state disabled, elemen grafik pendukung |
| Surface Light / Beige | `#EAE0CF` | Latar utama aplikasi, highlight halus hero section |
| Surface White | `#FFFFFF` | Card data, tabel, permukaan konten berisi angka |
| Semantic — Critical | Merah muted | Badge & indikator severity Critical |
| Semantic — High | Oranye muted | Badge & indikator severity High |
| Semantic — Medium | Kuning muted | Badge & indikator severity Medium |
| Semantic — Low | Biru muted | Badge & indikator severity Low |

### 2.2 Tipografi
- Font: **Plus Jakarta Sans** atau **Inter** (Google Fonts, legible untuk data teknis)
- Skala: H1 32px/Bold, H2 24px/Bold, H3 18px/Semibold, Body 14px/Regular, Caption 12px/Regular, Code/Monospace 13px (JetBrains Mono / Fira Code)
- Line-height body 1.5x untuk teks penjelasan kerentanan yang sering panjang

### 2.3 Spacing & Grid
- Base unit 4px; spacing umum 8/16/24/32/48px
- Grid desktop 12 kolom, max content width 1280px, sidebar tetap 240px
- Card radius 12px, button radius 8px — konsisten di seluruh komponen

### 2.4 Komponen Inti (Base Components)
- Button (Primary `#4B5694` / Secondary outline `#7288AE` / Destructive merah muted)
- Input Field (Default/Focus/Error/Disabled)
- Severity Badge (4 varian warna semantic, bentuk pill)
- Data Table (header sortable, row hover, empty state)
- Card (Summary Card dengan ikon + angka besar)
- Side Drawer & Modal (overlay gelap 40% opacity)
- Code Block (latar Dark Navy, teks monospace, syntax highlight semantic)
- Toast Notification (sukses/error/info, top-right, auto-dismiss 4 detik)

---

## 3. Information Architecture — Peta Seluruh Layar

**Modul A — Onboarding & Authentication**
- A1 — Landing / Login Screen
- A2 — Register / Sign Up Screen
- A3 — Onboarding Wizard — Buat Project Pertama

**Modul B — Core Scanning Flow**
- B1 — Dashboard Home (Project Overview)
- B2 — RapidScan Gateway (Scan Input)
- B3 — Advanced Settings (Accordion/Drawer)
- B4 — Live Scan Monitor (Progress Real-time)

**Modul C — Results & Insights**
- C1 — Risk Radar Dashboard (Scan Results Overview)
- C2 — Vulnerability Table (Full List View)
- C3 — Actionable Insights Panel (Detail Drawer)
- C4 — Scan Comparison / Trend View
- C5 — Compliance-Ready Exporter (Export Modal)

**Modul D — Project & Target Management**
- D1 — Projects / Targets List
- D2 — Add New Target Screen
- D3 — Target Detail & Schedule Settings

**Modul E — Team & Collaboration**
- E1 — Team Members & RBAC
- E2 — Invite Member Modal
- E3 — Vulnerability Ticketing (Assign & Status Tracking)

**Modul F — Account, Billing & Integrations**
- F1 — Account Settings / Profile
- F2 — Billing & Subscription
- F3 — Notification Center & Settings
- F4 — API & CI/CD Integration Settings

**Modul G — Empty, Error & Edge States**
- G1 — Empty State — Belum Ada Scan
- G2 — Error State — Scan Gagal / URL Tidak Valid
- G3 — Access Denied / Halaman Tidak Ditemukan

---

## 4. Spesifikasi Detail Layar per Modul

### Modul A — Onboarding & Authentication
*First impression produk. Harus terasa cepat & tidak birokratis — selesai <2 menit dari landing sampai bisa mulai scan pertama.*

#### A1 — Landing / Login Screen
- **Tujuan UX:** Kesan profesional B2B SaaS sejak detik pertama, login secepat mungkin tanpa friksi.
- **Trigger:** User membuka advise.app atau diarahkan ulang setelah session habis.
- **Komponen UI:**
  - Logo ADVISE kiri atas, latar Dark Navy (`#111844`)
  - Form login: Email, Password, tombol "Masuk" (`#4B5694`)
  - Link "Lupa password?" dan "Belum punya akun? Daftar"
  - Opsi SSO sekunder (Google Workspace)
  - Panel kanan (desktop, 50%): ilustrasi value proposition + tagline "Scan keamanan sehari, bukan seminggu"
- **States:** Default | Loading (spinner di tombol) | Error (kredensial salah) | Locked (terlalu banyak percobaan gagal)
- **Interaksi:** Validasi email real-time saat blur; tombol "Masuk" disabled sampai kedua field terisi; Enter submit form
- **Navigasi:** Sukses → B1 | "Daftar" → A2 | "Lupa password" → flow reset (di luar cakupan)
- **Catatan Figma:** Frame 1440x1024, auto-layout split 50/50. Bangun komponen Input Field (varian Default/Focus/Error) dan Button/Primary & Secondary di sini sebagai base component.

#### A2 — Register / Sign Up Screen
- **Tujuan UX:** Turunkan friksi pendaftaran tim kecil/startup.
- **Trigger:** Klik "Daftar" dari A1, atau dari halaman marketing eksternal.
- **Komponen UI:** Nama Lengkap, Email Kerja, Nama Perusahaan/Tim, Password; checkbox S&K; tombol "Buat Akun Gratis"; badge "Tidak perlu kartu kredit"
- **States:** Default | Validasi per-field (password strength bar) | Loading | Error (email sudah terdaftar)
- **Interaksi:** Strength meter berubah warna merah→kuning→hijau muted; submit sukses langsung auto-login (tanpa email verification blocking)
- **Navigasi:** Submit sukses → A3
- **Catatan Figma:** Reuse Input Field & Button dari A1; siapkan komponen "Password Strength Bar"

#### A3 — Onboarding Wizard — Buat Project Pertama
- **Tujuan UX:** Langsung ke aksi inti (scan pertama), bukan tour panjang.
- **Trigger:** Setelah register sukses (sekali per akun baru).
- **Komponen UI:** Headline "Selamat datang di ADVISE — yuk scan target pertamamu"; input nama Project (default "Project Pertama"); tombol "Lanjut ke Dashboard"; link "Lewati, saya akan buat nanti"
- **States:** Default | Loading saat membuat project
- **Interaksi:** Skip diizinkan agar power user tidak terhambat
- **Navigasi:** Lanjut/Skip → B1 (dengan empty state G1)
- **Catatan Figma:** Satu kolom, centered — reuse komponen lama, tidak perlu komponen baru

---

### Modul B — Core Scanning Flow
*Inti value proposition: dari "masukkan URL" sampai "scan berjalan" harus semudah search engine.*

#### B1 — Dashboard Home (Project Overview)
- **Tujuan UX:** Ringkasan status keamanan semua target dalam satu pandangan, beda dari RapidScan Gateway yang fokus aksi tunggal.
- **Trigger:** Setelah login, atau klik logo ADVISE.
- **Komponen UI:**
  - Sidebar kiri tetap (`#111844`): Dashboard, Targets, Scans, Team, Settings
  - Top bar: nama workspace aktif, avatar user, ikon notifikasi
  - Summary cards: total target aktif, total kerentanan Critical/High across project
  - CTA besar "+ Scan Baru" kanan atas (`#4B5694`)
  - Recent Scans table (Target, Tanggal, Status, Severity tertinggi) — klik baris → C1
- **States:** Populated | Empty (G1) | Loading skeleton
- **Interaksi:** Filter cepat (Semua/Running/Completed/Failed); badge "Running" pulse animation
- **Navigasi:** + Scan Baru → B2 | Klik baris → C1 | Sidebar Targets → D1
- **Catatan Figma:** Bangun "Sidebar Navigation" sebagai base layout semua layar setelah login; "Summary Card" reusable juga dipakai di C1

#### B2 — RapidScan Gateway (Scan Input)
- **Tujuan UX:** Reduce friction memulai scan — semudah Google search.
- **Trigger:** "+ Scan Baru" dari B1, atau dari D1 ("Scan Sekarang" pada target tersimpan)
- **Komponen UI:** Hero section terpusat, input besar placeholder "Masukkan target URL (mis. https://staging.client-web.com)"; tombol primer "Mulai Security Scan" (full-width di mobile); accordion "Advanced Settings" tertutup default; daftar Target Tersimpan sebagai shortcut
- **States:** Default | Validasi URL real-time (border merah + pesan jika salah) | Submitting (spinner + "Menyiapkan scan...")
- **Interaksi:** Auto-prefix https:// jika user tidak ketik; klik Advanced Settings expand in-place
- **Navigasi:** Submit → B4
- **Catatan Figma:** Layout 1 kolom, max-width 640px, centered. Background Light Beige (`#EAE0CF`) untuk bedakan dari dashboard data-heavy lain yang putih

#### B3 — Advanced Settings (Accordion/Drawer)
- **Tujuan UX:** Kontrol teknis (auth token, scan depth) bagi yang butuh, tanpa membebani user pemula.
- **Trigger:** Klik "Advanced Settings" di B2
- **Komponen UI:** Input Auth Token/Cookie session; dropdown Scan Depth (Quick/Standard/Deep, dengan estimasi durasi); textarea Exclude Paths; toggle "Jadwalkan scan berkala" (Harian/Mingguan)
- **States:** Collapsed (default) | Expanded
- **Interaksi:** Tooltip info (ⓘ) di tiap opsi teknis untuk junior dev
- **Navigasi:** Kembali ke B2 setelah disimpan in-place
- **Catatan Figma:** Komponen Accordion reusable; pastikan tinggi dinamis tidak mendorong CTA keluar viewport di layar kecil

#### B4 — Live Scan Monitor (Progress Real-time)
- **Tujuan UX:** Kurangi kecemasan menunggu — transparansi proses.
- **Trigger:** Otomatis setelah submit di B2
- **Komponen UI:** Progress bar besar dengan persentase (`#4B5694` fill di atas track `#7288AE`); status teks berjalan ("Memindai endpoint /login...", "Menguji SQL Injection..."); terminal-style log panel (expand opsional); counter kerentanan ditemukan real-time per severity; tombol "Jalankan di background"
- **States:** Running (live) | Completed (auto-redirect + toast) | Failed (G2)
- **Interaksi:** Estimasi waktu tersisa dinamis berdasarkan progres aktual
- **Navigasi:** Completed → C1 | "Jalankan di background" → B1 (badge Running di Recent Scans)
- **Catatan Figma:** Animasi progress bar nanti via Framer Motion; di Figma cukup 3 state frame (25%/60%/100%)

---

### Modul C — Results & Insights
*Paling kritikal untuk dua persona sekaligus: Tech Lead/PM butuh ringkasan cepat, Developer junior butuh panduan eksekusi.*

#### C1 — Risk Radar Dashboard (Scan Results Overview)
- **Tujuan UX:** Snapshot instan postur keamanan untuk Tech Lead/PM tanpa waktu baca laporan teknis penuh
- **Trigger:** Otomatis setelah scan selesai (B4), atau klik scan dari B1/D3
- **Komponen UI:** 4 Summary Cards (Total, Critical, High, Medium); Donut Chart "Risk Radar" (`#111844` & `#7288AE` + warna semantic); Risk Band Indicator (pill "Perlu Patch Segera" / "Aman"); tombol sticky "Export PDF Report"; Vulnerability Table ringkas (5 teratas) + "Lihat semua →"
- **States:** Hasil ada temuan | Bersih/Secure | Loading agregasi
- **Interaksi:** Klik segmen donut chart memfilter tabel di bawahnya
- **Navigasi:** Klik baris → C3 | "Lihat semua →" → C2 | "Export PDF" → C5 | "Bandingkan scan" → C4
- **Catatan Figma:** Donut Chart sebagai instance (dummy data), tag warna semantic terpisah dari token brand. Risk Band Indicator harus kontras AA minimum

#### C2 — Vulnerability Table (Full List View)
- **Tujuan UX:** Kontrol penuh QA Engineer untuk menyaring/mencari/mengelola seluruh temuan, tanpa batas 5 teratas
- **Trigger:** "Lihat semua →" dari C1
- **Komponen UI:** Search bar; filter chips (Severity, Status); tabel (Nama Kerentanan, URL Path, Severity badge, Status, Assignee, Tanggal); bulk action bar saat checkbox dipilih
- **States:** Populated | Filtered kosong | Loading
- **Interaksi:** Sort kolom via header; baris clickable
- **Navigasi:** Klik baris → C3 | Assign → E3 inline
- **Catatan Figma:** Data Table generik dengan slot kolom fleksibel, reusable juga di modul D

#### C3 — Actionable Insights Panel (Detail Drawer)
- **Tujuan UX:** Edukasi developer junior + remediasi instan tanpa pindah halaman
- **Trigger:** Klik baris vulnerability dari C1/C2
- **Komponen UI:** Side Drawer dari kanan (modal di mobile); header nama bug + Severity Badge; Tab Deskripsi (bahasa manusia, dampak bisnis); Tab Bukti (code block syntax highlight, payload); Tab Cara Memperbaiki (code snippet + tombol "Copy code"); footer: dropdown Status, input Assignee
- **States:** Tab Deskripsi aktif (default) | Tab Bukti | Tab Cara Memperbaiki | Status berubah (toast)
- **Interaksi:** Slide-in animasi halus; klik luar/tombol X menutup tanpa kehilangan posisi scroll tabel
- **Navigasi:** Tutup → kembali ke C1/C2 | Assign → E3
- **Catatan Figma:** Drawer ±420px desktop, full-screen mobile. Komponen Tabs reusable; code block component dengan token warna monospace beda dari UI utama

#### C4 — Scan Comparison / Trend View
- **Tujuan UX:** Tunjukkan progres keamanan dari waktu ke waktu — bukti perbaikan ke klien/manajemen
- **Trigger:** Link "Bandingkan dengan scan sebelumnya" dari C1, atau D3
- **Komponen UI:** Dua dropdown pemilih scan (A vs B); line/bar chart tren per severity; tabel diff (Baru / Sudah Diperbaiki / Masih Ada, dengan ikon panah)
- **States:** Populated (min 2 scan) | Kosong ("Butuh minimal 2 scan...")
- **Interaksi:** Hover titik chart → tooltip detail
- **Navigasi:** Klik item diff → C3
- **Catatan Figma:** Reuse chart component dari C1 varian line chart; warna naik (merah muted) vs turun (hijau muted)

#### C5 — Compliance-Ready Exporter (Export Modal)
- **Tujuan UX:** Generate laporan PDF profesional untuk klien/manajemen dengan usaha minimal
- **Trigger:** Klik "Export PDF Report" dari C1
- **Komponen UI:** Modal preview cover (input Nama Klien, tanggal auto, logo ADVISE); checkbox konten ("Sertakan Executive Summary", "Sertakan Bukti Teknis", "Sertakan Rekomendasi"); dropdown template; tombol "Generate PDF" dengan loading state
- **States:** Form default | Generating (spinner "Menyusun laporan...") | Selesai (tombol download + toast)
- **Interaksi:** Live preview thumbnail cover update saat Nama Klien diketik
- **Navigasi:** Generate selesai → tombol "Unduh PDF", modal tetap terbuka untuk export ulang opsi lain
- **Catatan Figma:** Modal centered max-width 560px. Siapkan frame terpisah mockup halaman PDF report (cover + ringkasan) sebagai referensi visual

---

### Modul D — Project & Target Management
*Mendukung recurring scan dan multi-target untuk software house yang kelola banyak proyek klien.*

#### D1 — Projects / Targets List
- **Tujuan UX:** Pandangan menyeluruh semua target yang dikelola tim
- **Trigger:** Klik menu "Targets" di sidebar
- **Komponen UI:** Tabel/grid target (Nama, URL, Environment, Scan Terakhir, Status ringkas); tombol "+ Tambah Target"; search & filter environment/status
- **States:** Populated | Empty (G1)
- **Interaksi:** Klik target → D3
- **Navigasi:** + Tambah Target → D2 | Klik target → D3
- **Catatan Figma:** Reuse Data Table dari C2 dengan kolom berbeda

#### D2 — Add New Target Screen
- **Tujuan UX:** Simpan target permanen (bukan one-off) agar bisa dijadwalkan & dilacak trennya
- **Trigger:** "+ Tambah Target" dari D1
- **Komponen UI:** Form (Nama Target, URL utama, Environment dropdown, Deskripsi); checkbox "Scan sekarang setelah disimpan"
- **States:** Default | Validasi duplikat URL
- **Navigasi:** Simpan → D3 (atau B4 jika opsi scan-sekarang dicentang)
- **Catatan Figma:** Form satu kolom, reuse Input Field

#### D3 — Target Detail & Schedule Settings
- **Tujuan UX:** Pusat kendali satu target — riwayat, jadwal otomatis, integrasi terkait
- **Trigger:** Klik target dari D1
- **Komponen UI:** Header (nama target, URL, tombol "Scan Sekarang"); riwayat scan kronologis (klik baris → C1); pengaturan jadwal scan berkala; tombol "Bandingkan 2 scan" → C4
- **States:** Populated | Belum pernah discan (CTA besar)
- **Navigasi:** Scan Sekarang → B2 (URL ter-prefill) atau langsung B4 | Klik riwayat → C1
- **Catatan Figma:** Layout 2 kolom: kiri info & jadwal, kanan riwayat scan

---

### Modul E — Team & Collaboration
*Memastikan temuan kerentanan bisa didelegasikan dan dilacak penyelesaiannya.*

#### E1 — Team Members & RBAC
- **Tujuan UX:** Kelola akses tim sesuai role (Admin, Member, Viewer/Klien) tanpa kompleksitas enterprise berlebihan
- **Trigger:** Klik menu "Team"
- **Komponen UI:** Tabel anggota (Nama, Email, Role dropdown inline, Status); tombol "+ Undang Anggota"
- **States:** Populated | Empty (hanya pemilik akun)
- **Interaksi:** Ubah role langsung dari dropdown di tabel
- **Navigasi:** + Undang Anggota → E2
- **Catatan Figma:** Reuse Data Table

#### E2 — Invite Member Modal
- **Tujuan UX:** Percepat penambahan anggota tim baru
- **Trigger:** "+ Undang Anggota" dari E1
- **Komponen UI:** Input email (multiple, dipisah koma); dropdown Role default; tombol "Kirim Undangan"
- **States:** Default | Terkirim (toast)
- **Navigasi:** Kirim → kembali ke E1, status "Diundang"
- **Catatan Figma:** Modal kecil, centered, max-width 480px

#### E3 — Vulnerability Ticketing (Assign & Status Tracking)
- **Tujuan UX:** Jadikan tiap temuan item kerja yang bisa ditugaskan & dipantau — jembatani gap "ditemukan" vs "diperbaiki"
- **Trigger:** Footer C3 saat klik "Assign", atau bulk action di C2
- **Komponen UI:** Dropdown Assignee; dropdown Status (Open/In Progress/Resolved/False Positive); kolom catatan opsional
- **States:** Default | Tersimpan (badge status update real-time di C2)
- **Interaksi:** Notifikasi otomatis ke assignee saat ditugaskan (F3)
- **Navigasi:** Simpan → kembali ke konteks asal
- **Catatan Figma:** Komponen inline di drawer C3, bukan layar penuh terpisah

---

### Modul F — Account, Billing & Integrations
*Mendukung harga lokal Rupiah serta integrasi CI/CD — gain creator utama dari VPC.*

#### F1 — Account Settings / Profile
- **Tujuan UX:** Pengaturan dasar akun
- **Trigger:** Klik avatar top bar → "Pengaturan Akun"
- **Komponen UI:** Form profil (Nama, Email, Foto); Ubah Password; preferensi bahasa
- **States:** Default | Tersimpan (toast)
- **Navigasi:** Tab Billing → F2 | Tab Notifikasi → F3 | Tab Integrasi → F4
- **Catatan Figma:** Layout settings standar dengan tab navigation horizontal

#### F2 — Billing & Subscription
- **Tujuan UX:** Transparansi harga lokal Rupiah — jawab pain point "DAST global terlalu mahal dalam USD"
- **Trigger:** Tab "Billing" dari F1
- **Komponen UI:** Plan aktif (harga Rupiah); tabel perbandingan plan (Free Trial / Pay-per-Scan / Tim); riwayat invoice; tombol "Upgrade Plan"
- **States:** Trial aktif (banner sisa hari) | Plan berbayar aktif
- **Navigasi:** Upgrade → flow pembayaran (di luar cakupan)
- **Catatan Figma:** Card per plan dengan highlight border pada plan aktif

#### F3 — Notification Center & Settings
- **Tujuan UX:** Pastikan user tidak ketinggalan info penting tanpa polling dashboard terus
- **Trigger:** Ikon lonceng top bar, atau Tab Notifikasi di F1
- **Komponen UI:** Notification Center (dropdown panel: scan selesai, ticket assigned, kerentanan Critical baru); Settings toggle per jenis notifikasi (Email/In-app)
- **States:** Ada notifikasi belum dibaca (badge merah) | Semua dibaca
- **Interaksi:** Klik notifikasi langsung membuka konteks terkait
- **Navigasi:** Klik item → C1/C3/B4
- **Catatan Figma:** Dropdown panel ±360px menempel di bawah ikon lonceng

#### F4 — API & CI/CD Integration Settings
- **Tujuan UX:** Shift-left security — developer trigger scan otomatis dari pipeline CI/CD
- **Trigger:** Tab "Integrasi" dari F1
- **Komponen UI:** Generate/revoke API Key + tombol copy; contoh snippet (cURL/GitHub Actions/GitLab CI) siap-copy; Webhook URL ke Slack/Jira
- **States:** Belum ada API key (CTA generate) | Aktif (masked + reveal)
- **Interaksi:** Tombol "Copy" tiap snippet dengan toast "Disalin!"
- **Catatan Figma:** Reuse code block component dari C3 (tab Bukti) untuk konsistensi visual monospace

---

### Modul G — Empty, Error & Edge States
*Sering dilupakan padahal krusial untuk first-time experience dan kepercayaan pengguna saat gagal.*

#### G1 — Empty State — Belum Ada Scan
- **Tujuan UX:** Arahkan user baru ke aksi pertama tanpa dashboard kosong membingungkan
- **Trigger:** B1 saat akun baru belum pernah scan
- **Komponen UI:** Ilustrasi sederhana tema radar/shield (`#7288AE`); headline "Belum ada scan. Yuk mulai yang pertama."; CTA besar "+ Scan Baru"
- **Navigasi:** CTA → B2
- **Catatan Figma:** Ilustrasi flat/line-art, jangan terlalu playful — tetap profesional B2B

#### G2 — Error State — Scan Gagal / URL Tidak Valid
- **Tujuan UX:** Penjelasan jelas + langkah pemulihan, bukan pesan teknis membingungkan
- **Trigger:** B4 gagal (unreachable, timeout, diblokir WAF)
- **Komponen UI:** Ikon error (merah muted, tidak agresif); pesan spesifik ("Target tidak dapat dijangkau" / "Timeout 60 detik" / "Diblokir firewall target"); saran troubleshooting 2-3 poin; tombol "Coba Scan Ulang" & "Kembali ke Dashboard"
- **States:** Unreachable | Timeout | Blocked by WAF
- **Navigasi:** Coba Lagi → B2 (URL ter-prefill) | Kembali → B1
- **Catatan Figma:** Varian dari frame B4 yang sama, bukan layar terpisah

#### G3 — Access Denied / Halaman Tidak Ditemukan
- **Tujuan UX:** Tangani akses tanpa izin (role Viewer ke Billing) atau link rusak
- **Trigger:** Navigasi langsung tanpa izin, atau resource sudah dihapus
- **Komponen UI:** Ilustrasi minimal; pesan jelas ("Kamu tidak punya akses ke halaman ini" / "Halaman tidak ditemukan"); tombol "Kembali ke Dashboard"
- **States:** 403 Access Denied | 404 Not Found
- **Navigasi:** Tombol → B1
- **Catatan Figma:** Layar generik, reuse untuk kedua kasus dengan teks berbeda

---

## 5. Ringkasan Alur Pengguna End-to-End

### Journey 1 — First-time User (Tech Lead Software House)
1. A1 Login/Daftar → A2 Register → A3 Onboarding (skip atau buat project)
2. B1 Dashboard Home (Empty State G1) → klik "+ Scan Baru"
3. B2 RapidScan Gateway → masukkan URL staging klien → (opsional) B3 Advanced Settings untuk auth token
4. B4 Live Scan Monitor (real-time progress)
5. C1 Risk Radar Dashboard → lihat ringkasan, share status ke manajemen
6. C5 Compliance-Ready Exporter → generate PDF untuk laporan ke klien

### Journey 2 — Developer Junior Melakukan Remediasi
1. Menerima notifikasi (F3) bahwa ticket di-assign ke dirinya
2. Klik notifikasi → langsung masuk ke C3 Actionable Insights Panel
3. Baca tab Deskripsi → tab Bukti → tab Cara Memperbaiki (copy code snippet)
4. Ubah status "In Progress" lalu setelah deploy fix → "Resolved"
5. Tech Lead verifikasi via C4 Scan Comparison pada scan berikutnya

### Journey 3 — DevSecOps Mengatur Scan Otomatis Berkala
1. D1 Targets List → D2 Tambah Target baru (URL production)
2. D3 Target Detail → atur jadwal scan mingguan
3. F4 API & CI/CD Integration → generate API key, tempel snippet ke GitHub Actions
4. Setiap scan otomatis selesai → notifikasi (F3), hasil masuk ke riwayat D3 dan C1

---

## 6. Prompt Siap Pakai — Eksekusi Cepat di Figma

> Peran: Bertindak sebagai Senior Product Designer untuk SaaS B2B.
> Produk: ADVISE — DAST SaaS untuk software house, QA engineer, dan junior developer di Indonesia.
> Design tokens: Primary #111844, Secondary #4B5694, Tertiary #7288AE, Surface #EAE0CF & #FFFFFF, semantic merah/oranye/kuning/biru muted untuk severity. Font Plus Jakarta Sans/Inter. Radius card 12px, button 8px.
> Bangun base components dulu: Button, Input Field, Severity Badge, Data Table, Card, Side Drawer, Code Block, Toast — sebelum menyusun layar.
> Susun 25 frame sesuai ID & nama pada Bagian 3, dikelompokkan per modul (Onboarding, Core Scanning, Results & Insights, Project Management, Team, Account/Billing, Edge States).
> Untuk setiap frame, rujuk spesifikasi Komponen UI, States, dan Catatan Build Figma pada Bagian 4 sebagai requirement layout.
> Pastikan navigasi antar frame memakai Figma prototyping link sesuai kolom Navigasi Lanjutan tiap layar, agar clickable prototype bisa diuji end-to-end mengikuti 3 user journey pada Bagian 5.
> Vibe akhir: profesional B2B, minim friksi kognitif, ramah untuk developer junior — hindari ilustrasi terlalu playful atau warna terlalu jenuh.

---

## 7. Saran Langkah Selanjutnya
- Bangun dulu Design System file terpisah di Figma (Bagian 2) sebelum menyentuh frame layar manapun
- Prioritaskan Modul B & C sebagai clickable prototype pertama — ini inti value proposition yang paling perlu divalidasi
- Modul E (Team) dan F (Billing/Integrations) bisa didesain belakangan sebagai fase 2
- Setelah prototype Modul B & C selesai, lakukan usability testing singkat ke 2-3 target user sebelum lanjut ke modul lain