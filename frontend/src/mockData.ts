export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type VulnStatus = 'Open' | 'In Progress' | 'Resolved' | 'False Positive';
export type ScanStatus = 'Running' | 'Completed' | 'Failed';
export type Environment = 'Production' | 'Staging' | 'Development' | 'QA';
export type Role = 'Admin' | 'Member' | 'Viewer';
export type MemberStatus = 'Active' | 'Invited';

export interface Vulnerability {
  id: string;
  name: string;
  path: string;
  severity: Severity;
  status: VulnStatus;
  assignee: string | null;
  date: string;
  description: string;
  impact: string;
  evidence: string;
  fix: string;
  cve?: string;
}

export interface Scan {
  id: string;
  targetId: string;
  targetName: string;
  targetUrl: string;
  date: string;
  status: ScanStatus;
  highestSeverity: Severity | null;
  vulnerabilities: Vulnerability[];
  duration: string;
  summary: { critical: number; high: number; medium: number; low: number; total: number };
}

export interface Target {
  id: string;
  name: string;
  url: string;
  environment: Environment;
  description: string;
  lastScanDate: string | null;
  lastScanStatus: ScanStatus | null;
  highestSeverity: Severity | null;
  scheduleEnabled: boolean;
  scheduleFrequency: 'Daily' | 'Weekly' | 'Monthly';
  scansCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  avatar: string;
}

export const mockVulnerabilities: Vulnerability[] = [
  {
    id: 'v1',
    name: 'SQL Injection pada /api/users',
    path: '/api/users?id=1',
    severity: 'Critical',
    status: 'Open',
    assignee: 'Budi Santoso',
    date: '2026-06-28',
    cve: 'CVE-2024-12345',
    description: 'Endpoint /api/users rentan terhadap serangan SQL Injection melalui parameter "id". Penyerang dapat mengekstrak seluruh database termasuk data sensitif pengguna, kredensial, dan data bisnis.',
    impact: 'Dampak bisnis sangat besar: kebocoran data pelanggan, potensi denda PDPA/GDPR, kerusakan reputasi. Penyerang dapat membaca, memodifikasi, atau menghapus seluruh data di database.',
    evidence: `GET /api/users?id=1' OR '1'='1 HTTP/1.1\nHost: staging.client-web.com\n\nResponse (200 OK):\n[\n  {"id":1,"email":"admin@company.com","password_hash":"$2b$10$..."},\n  {"id":2,"email":"user@company.com","password_hash":"$2b$10$..."}\n]`,
    fix: `// SEBELUM (rentan):\nconst query = \`SELECT * FROM users WHERE id = \${req.params.id}\`;\n\n// SESUDAH (aman - gunakan parameterized query):\nconst query = 'SELECT * FROM users WHERE id = ?';\nconst [rows] = await db.execute(query, [req.params.id]);\n\n// Atau gunakan ORM:\nconst user = await User.findByPk(req.params.id);`,
  },
  {
    id: 'v2',
    name: 'Cross-Site Scripting (XSS) Reflected',
    path: '/search?q=<script>',
    severity: 'High',
    status: 'In Progress',
    assignee: 'Siti Rahayu',
    date: '2026-06-28',
    cve: 'CVE-2024-23456',
    description: 'Halaman pencarian memantulkan input pengguna langsung ke HTML tanpa sanitasi. Penyerang dapat menyisipkan script berbahaya yang dieksekusi di browser korban.',
    impact: 'Dapat digunakan untuk mencuri session cookie, melakukan phishing, atau redirect ke situs berbahaya. Mempengaruhi semua pengguna yang mengklik link berbahaya.',
    evidence: `GET /search?q=<script>alert(document.cookie)</script> HTTP/1.1\n\nResponse HTML:\n<div class="results">Hasil untuk: <script>alert(document.cookie)</script></div>`,
    fix: `// SEBELUM (rentan):\nres.send(\`<div>Hasil untuk: \${req.query.q}</div>\`);\n\n// SESUDAH (gunakan escaping):\nimport { escapeHtml } from './utils';\nres.send(\`<div>Hasil untuk: \${escapeHtml(req.query.q)}</div>\`);\n\n// Atau di React (sudah aman by default):\nconst SearchResults = ({ query }) => (\n  <div>Hasil untuk: {query}</div> // React auto-escapes\n);`,
  },
  {
    id: 'v3',
    name: 'Broken Authentication — Session Tidak Expire',
    path: '/api/auth/session',
    severity: 'High',
    status: 'Open',
    assignee: null,
    date: '2026-06-27',
    description: 'Session token tidak memiliki waktu kadaluarsa (expiry). Jika token bocor, penyerang dapat menggunakannya selamanya tanpa batas.',
    impact: 'Akun pengguna dapat dikompromikan secara permanen jika session token dicuri. Tidak ada proteksi terhadap stolen sessions.',
    evidence: `// JWT payload yang ditemukan:\n{\n  "sub": "user_123",\n  "iat": 1709000000,\n  "exp": null  // ← TIDAK ADA EXPIRY!\n}`,
    fix: `// Set expiry saat generate JWT:\nconst token = jwt.sign(\n  { sub: user.id },\n  process.env.JWT_SECRET,\n  { expiresIn: '8h' } // ← tambahkan expiry\n);\n\n// Dan implementasikan refresh token pattern\n// untuk UX yang baik`,
  },
  {
    id: 'v4',
    name: 'Sensitive Data Exposure — API Key Terekspos',
    path: '/js/app.bundle.js',
    severity: 'High',
    status: 'Resolved',
    assignee: 'Budi Santoso',
    date: '2026-06-26',
    description: 'API key layanan pihak ketiga ditemukan hardcoded dalam file JavaScript bundle yang dapat diakses publik.',
    impact: 'Pihak tidak berwenang dapat menyalahgunakan API key untuk keperluan tidak sah, menimbulkan biaya tidak terduga atau penyalahgunaan layanan.',
    evidence: `// Dalam /js/app.bundle.js (line 4521):\nconst STRIPE_KEY = "secret_stripe_api_key_here";\nconst SENDGRID_KEY = "SG.xxxxxxxxxxxxxxxxxxxxxxx";`,
    fix: `// Pindahkan ke environment variables:\n// .env (jangan commit ke git!)\nSTRIPE_KEY=secret_stripe_api_key_here\n\n// Akses via process.env:\nconst stripe = Stripe(process.env.STRIPE_KEY);\n\n// Untuk frontend, hanya gunakan publishable key\n// (bukan secret key) dan lewat env vars Vite:\n// VITE_STRIPE_PUBLIC_KEY=public_stripe_api_key_here`,
  },
  {
    id: 'v5',
    name: 'Missing Security Headers',
    path: '/',
    severity: 'Medium',
    status: 'Open',
    assignee: 'Siti Rahayu',
    date: '2026-06-28',
    description: 'Response HTTP tidak menyertakan security headers penting seperti Content-Security-Policy, X-Frame-Options, dan Strict-Transport-Security.',
    impact: 'Meningkatkan risiko serangan clickjacking, MITM, dan serangan injeksi konten.',
    evidence: `HTTP/1.1 200 OK\nContent-Type: text/html\n// ← Tidak ada:\n// Content-Security-Policy\n// X-Frame-Options\n// Strict-Transport-Security\n// X-Content-Type-Options`,
    fix: `// Tambahkan middleware Helmet.js di Express:\nimport helmet from 'helmet';\napp.use(helmet());\n\n// Atau konfigurasi manual:\napp.use((req, res, next) => {\n  res.setHeader('X-Frame-Options', 'DENY');\n  res.setHeader('X-Content-Type-Options', 'nosniff');\n  res.setHeader('Strict-Transport-Security', 'max-age=31536000');\n  next();\n});`,
  },
  {
    id: 'v6',
    name: 'Insecure Direct Object Reference (IDOR)',
    path: '/api/documents/:id',
    severity: 'Medium',
    status: 'Open',
    assignee: null,
    date: '2026-06-27',
    description: 'Endpoint /api/documents/:id tidak memverifikasi bahwa pengguna yang request memiliki akses ke dokumen tersebut.',
    impact: 'Pengguna biasa dapat mengakses dokumen milik pengguna lain hanya dengan mengubah angka ID di URL.',
    evidence: `// User A (id=1) mengakses dokumen user B:\nGET /api/documents/456 HTTP/1.1\nAuthorization: Bearer <token_user_A>\n\nResponse 200 OK: { "title": "Kontrak Rahasia User B", ... }`,
    fix: `// Tambahkan authorization check:\napp.get('/api/documents/:id', authenticate, async (req, res) => {\n  const doc = await Document.findByPk(req.params.id);\n  \n  // Verifikasi kepemilikan:\n  if (doc.userId !== req.user.id) {\n    return res.status(403).json({ error: 'Forbidden' });\n  }\n  \n  res.json(doc);\n});`,
  },
  {
    id: 'v7',
    name: 'Outdated Dependency — Log4j Vulnerability',
    path: '/package.json',
    severity: 'Low',
    status: 'False Positive',
    assignee: 'Budi Santoso',
    date: '2026-06-25',
    description: 'Deteksi dependency dengan versi yang sudah tidak didukung. False positive — dependency ini di sisi frontend dan tidak menggunakan Log4j.',
    impact: 'Tidak ada dampak nyata (false positive).',
    evidence: `// Dari package-lock.json:\n"some-package": {\n  "version": "1.2.3",\n  "resolved": "...",\n  // Versi lama, butuh verifikasi manual\n}`,
    fix: `// Jalankan audit:\nnpm audit\nnpm audit fix\n\n// Atau update manual:\nnpm update some-package`,
  },
];

export const mockScans: Scan[] = [
  {
    id: 's1',
    targetId: 't1',
    targetName: 'Client Web App - Staging',
    targetUrl: 'https://staging.client-web.com',
    date: '2026-06-28T14:30:00',
    status: 'Completed',
    highestSeverity: 'Critical',
    vulnerabilities: mockVulnerabilities,
    duration: '4m 32s',
    summary: { critical: 1, high: 3, medium: 2, low: 1, total: 7 },
  },
  {
    id: 's2',
    targetId: 't1',
    targetName: 'Client Web App - Staging',
    targetUrl: 'https://staging.client-web.com',
    date: '2026-06-21T10:15:00',
    status: 'Completed',
    highestSeverity: 'High',
    vulnerabilities: mockVulnerabilities.slice(1, 5),
    duration: '3m 47s',
    summary: { critical: 0, high: 3, medium: 2, low: 0, total: 5 },
  },
  {
    id: 's3',
    targetId: 't2',
    targetName: 'E-Commerce API - Production',
    targetUrl: 'https://api.ecommerce-client.com',
    date: '2026-06-27T09:00:00',
    status: 'Completed',
    highestSeverity: 'High',
    vulnerabilities: mockVulnerabilities.slice(2, 6),
    duration: '6m 12s',
    summary: { critical: 0, high: 2, medium: 2, low: 0, total: 4 },
  },
  {
    id: 's4',
    targetId: 't3',
    targetName: 'Internal Dashboard - Dev',
    targetUrl: 'https://dev.internal-dashboard.com',
    date: '2026-06-26T16:45:00',
    status: 'Failed',
    highestSeverity: null,
    vulnerabilities: [],
    duration: '0m 12s',
    summary: { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
  },
];

export const mockTargets: Target[] = [
  {
    id: 't1',
    name: 'Client Web App - Staging',
    url: 'https://staging.client-web.com',
    environment: 'Staging',
    description: 'Aplikasi web utama klien PT Maju Sejahtera untuk lingkungan staging.',
    lastScanDate: '2026-06-28',
    lastScanStatus: 'Completed',
    highestSeverity: 'Critical',
    scheduleEnabled: true,
    scheduleFrequency: 'Weekly',
    scansCount: 2,
  },
  {
    id: 't2',
    name: 'E-Commerce API - Production',
    url: 'https://api.ecommerce-client.com',
    environment: 'Production',
    description: 'REST API backend untuk platform e-commerce klien.',
    lastScanDate: '2026-06-27',
    lastScanStatus: 'Completed',
    highestSeverity: 'High',
    scheduleEnabled: true,
    scheduleFrequency: 'Weekly',
    scansCount: 1,
  },
  {
    id: 't3',
    name: 'Internal Dashboard - Dev',
    url: 'https://dev.internal-dashboard.com',
    environment: 'Development',
    description: 'Dashboard internal tim untuk environment development.',
    lastScanDate: '2026-06-26',
    lastScanStatus: 'Failed',
    highestSeverity: null,
    scheduleEnabled: false,
    scheduleFrequency: 'Monthly',
    scansCount: 1,
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'm1',
    name: 'Andi Prakoso',
    email: 'andi@softwarehouse.id',
    role: 'Admin',
    status: 'Active',
    avatar: 'AP',
  },
  {
    id: 'm2',
    name: 'Budi Santoso',
    email: 'budi@softwarehouse.id',
    role: 'Member',
    status: 'Active',
    avatar: 'BS',
  },
  {
    id: 'm3',
    name: 'Siti Rahayu',
    email: 'siti@softwarehouse.id',
    role: 'Member',
    status: 'Active',
    avatar: 'SR',
  },
  {
    id: 'm4',
    name: 'Dewi Anggraeni',
    email: 'dewi@client.com',
    role: 'Viewer',
    status: 'Active',
    avatar: 'DA',
  },
  {
    id: 'm5',
    name: 'Reza Firmansyah',
    email: 'reza@softwarehouse.id',
    role: 'Member',
    status: 'Invited',
    avatar: 'RF',
  },
];
