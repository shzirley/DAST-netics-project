"use client";

import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle, Lock, FileX } from 'lucide-react';

export function EmptyState() {
  const router = useRouter();
  return (
    <div className="flex flex-1 items-center justify-center min-h-full py-20 px-4">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'var(--muted)' }}>
          <Shield size={36} style={{ color: 'var(--advise-steel)' }} />
        </div>
        <h2 className="mb-2" style={{ color: 'var(--advise-navy)', fontSize: 20, fontWeight: 700 }}>Belum Ada Scan</h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--advise-steel)' }}>
          Mulai scan DAST pertama untuk menemukan kerentanan di aplikasi Anda sebelum penyerang menemukannya.
        </p>
        <button
          onClick={() => router.push('/dashboard/scan')}
          className="px-6 py-3 rounded-xl text-white flex items-center gap-2 mx-auto text-sm hover:opacity-90"
          style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
        >
          + Mulai Scan Pertama
        </button>
        <p className="mt-4 text-xs" style={{ color: 'var(--advise-steel)' }}>
          Setup dalam 30 detik · Tidak perlu konfigurasi teknis
        </p>
      </div>
    </div>
  );
}

export function ScanErrorState({ type = 'unreachable' }: { type?: 'unreachable' | 'timeout' | 'waf' }) {
  const router = useRouter();

  const errors = {
    unreachable: {
      title: 'Target Tidak Dapat Dijangkau',
      desc: 'Server tidak merespons. Pastikan URL target benar dan server sedang berjalan.',
      tips: [
        'Verifikasi URL dan pastikan tidak ada typo',
        'Cek apakah server staging sedang aktif',
        'Pastikan tidak ada firewall yang memblokir akses dari luar',
      ],
    },
    timeout: {
      title: 'Timeout setelah 60 Detik',
      desc: 'Server merespons terlalu lambat atau koneksi tidak stabil.',
      tips: [
        'Coba lagi di waktu yang berbeda',
        'Cek status server target',
        'Pertimbangkan gunakan scan "Quick" untuk target lambat',
      ],
    },
    waf: {
      title: 'Diblokir oleh Firewall / WAF',
      desc: 'Target memiliki WAF yang memblokir request dari scanner ADVISE.',
      tips: [
        'Whitelist IP scanner ADVISE (hubungi support untuk daftar IP)',
        'Gunakan mode "Stealth" di Advanced Settings',
        'Scan di lingkungan staging yang tidak dilindungi WAF',
      ],
    },
  };

  const err = errors[type];

  return (
    <div className="flex flex-1 items-center justify-center min-h-full py-20 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'var(--advise-critical-bg)' }}>
          <AlertTriangle size={36} style={{ color: 'var(--advise-critical)' }} />
        </div>
        <h2 className="mb-2" style={{ color: 'var(--advise-navy)', fontSize: 20, fontWeight: 700 }}>{err.title}</h2>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--advise-steel)' }}>{err.desc}</p>

        <div className="text-left rounded-xl p-4 mb-6" style={{ background: 'var(--muted)' }}>
          <p className="text-xs mb-2" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>Langkah Troubleshooting:</p>
          <ul className="space-y-1.5">
            {err.tips.map((tip, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--advise-steel)' }}>
                <span style={{ color: 'var(--advise-indigo)', fontWeight: 700 }}>{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/dashboard/scan')}
            className="px-5 py-2.5 rounded-xl text-white text-sm"
            style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
          >
            Coba Scan Ulang
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-5 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', fontWeight: 600 }}
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export function AccessDeniedPage({ type = '403' }: { type?: '403' | '404' }) {
  const router = useRouter();

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen py-20 px-4" style={{ background: 'var(--advise-beige)' }}>
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'var(--muted)' }}>
          {type === '403' ? (
            <Lock size={36} style={{ color: 'var(--advise-steel)' }} />
          ) : (
            <FileX size={36} style={{ color: 'var(--advise-steel)' }} />
          )}
        </div>
        <p className="mb-2 text-5xl" style={{ fontWeight: 800, color: 'var(--advise-navy)', opacity: 0.15 }}>
          {type}
        </p>
        <h2 className="mb-2" style={{ color: 'var(--advise-navy)', fontSize: 20, fontWeight: 700 }}>
          {type === '403' ? 'Akses Ditolak' : 'Halaman Tidak Ditemukan'}
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--advise-steel)' }}>
          {type === '403'
            ? 'Kamu tidak memiliki izin untuk mengakses halaman ini. Hubungi Admin workspace untuk mendapatkan akses.'
            : 'Halaman yang kamu cari tidak ditemukan atau sudah dihapus.'}
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2.5 rounded-xl text-white text-sm hover:opacity-90"
          style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
