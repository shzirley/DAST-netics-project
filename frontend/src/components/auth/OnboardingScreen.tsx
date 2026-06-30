"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight } from 'lucide-react';

export function OnboardingScreen() {
  const router = useRouter();
  const [projectName, setProjectName] = useState('Project Pertama');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--advise-beige)' }}>
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid var(--border)' }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: 'var(--advise-navy)' }}>
              <Shield size={32} className="text-white" />
            </div>
            <h1 style={{ color: 'var(--advise-navy)', fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
              Selamat datang di ADVISE!
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--advise-steel)' }}>
              Yuk scan target pertamamu dan temukan kerentanan dalam menit
            </p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>
              Nama Project
            </label>
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--advise-navy)',
                background: 'var(--input-background)',
                fontSize: 15,
              }}
            />
            <p className="mt-1.5 text-xs" style={{ color: 'var(--advise-steel)' }}>
              Bisa diubah kapan saja nanti
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {[
              { icon: '🎯', title: 'Scan DAST Otomatis', desc: 'Deteksi kerentanan nyata di aplikasi web secara otomatis' },
              { icon: '📊', title: 'Risk Radar Dashboard', desc: 'Pantau postur keamanan semua proyek dalam satu tampilan' },
              { icon: '📄', title: 'Laporan Siap Kirim', desc: 'Export PDF profesional untuk klien dalam satu klik' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{item.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--advise-steel)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!projectName.trim() || loading}
            className="w-full py-3 rounded-xl text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyiapkan dashboard...
              </span>
            ) : (
              <>
                Lanjut ke Dashboard
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full mt-3 py-2 text-sm text-center"
            style={{ color: 'var(--advise-steel)' }}
          >
            Lewati, saya akan buat nanti
          </button>
        </div>
      </div>
    </div>
  );
}
