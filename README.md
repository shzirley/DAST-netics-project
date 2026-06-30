# DAST "Advise" 🛡️

**Advise** adalah prototipe antarmuka aplikasi *Dynamic Application Security Testing* (DAST) berbasis *Software as a Service* (SaaS) yang dirancang secara khusus untuk memenuhi kebutuhan pengujian keamanan aplikasi web bagi kalangan *Software House*, *QA Engineer*, dan *Developer* junior.

Proyek ini secara mendalam berfokus pada **perancangan arsitektur antarmuka (UI/UX)** dan **logika data simulasi keamanan siber**. Kode ini mendemonstrasikan bagaimana aplikasi keamanan siber memvisualisasikan temuan kerentanan teknis (seperti OWASP Top 10), *Live Scanning Throughput*, dan tingkat *Code Coverage* ke dalam antarmuka yang ramah pengguna namun tetap berstandar profesional.

## 🌟 Fitur Utama (UI/UX Modules)

- **RapidScan Gateway**: Antarmuka *onboarding* pemindaian target URL (*Quick, Standard, Deep Scan*) dengan kapabilitas pengaturan teknis lanjutan seperti injeksi *Auth Token* dan konfigurasi *Concurrent Requests*.
- **Risk Radar Dashboard**: Dasbor komprehensif yang menampilkan distribusi risiko, metrik ancaman berdasarkan level keparahan (*Critical, High, Medium*), dan grafik *real-time*.
- **Actionable Insights Panel**: Laci geser interaktif untuk melihat detail kerentanan spesifik yang mencakup deskripsi teknis, *Payload Evidence* dari celah keamanan (contoh: *SQL Injection, XSS*), serta *snippet* cara memperbaikinya.
- **Compliance-Ready Design**: Menyimulasikan fitur pembuatan laporan audit otomatis (*Export to PDF*) untuk diintegrasikan ke proses *compliance*.

## 📁 Struktur Repositori

Repositori ini terbagi dalam dua pilar utama:
1. **`/frontend`**: Kode implementasi antarmuka berbasis web.
   - Menggunakan **Next.js (App Router)** dan **Tailwind CSS**.
   - Arsitektur berbasis komponen *(Component-Driven)* yang dipisahkan rapi berdasarkan ranah fitur (misal: `components/results`, `components/scanning`).
   - Dilengkapi berkas `mockData.ts` yang menyimpan model data spesifik celah keamanan siber sebagai fondasi representasi tabel dan grafik.
2. **`/laporan`**: Folder yang memuat *source-code* laporan LaTeX beserta hasil akhir `laporan_dast_advise.pdf`. Laporan ini merinci spesifikasi teknis desain, urgensi pengembangan fitur, hingga *prompting* metodologi AI yang digunakan dalam penyusunan antarmuka.

## 🚀 Cara Menjalankan Frontend Secara Lokal

Pastikan Anda memiliki [Node.js](https://nodejs.org/) yang sudah terinstal.

1. Masuk ke direktori proyek frontend:
   ```bash
   cd frontend
   ```
2. Instal dependensi library yang dibutuhkan:
   ```bash
   npm install
   ```
3. Nyalakan server simulasi:
   ```bash
   npm run dev
   ```
4. Buka browser pada tautan [http://localhost:3000](http://localhost:3000) untuk berinteraksi dengan aplikasi.

## 👩‍💻 Pengembang
Dikembangkan untuk keperluan penilaian desain arsitektur dan struktur *frontend*.

*   **Angela Vania Sugiyono** (5025241226)

---
*Proyek ini dirancang di bawah konteks mata kuliah/pengembangan produk dengan metrik yang dioptimalkan untuk menunjukkan kompleksitas struktur logika data Cybersecurity.*
