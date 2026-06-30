"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from 'lucide-react';

function PasswordStrengthBar({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  };
  const strength = getStrength();
  const labels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
  const colors = ['', 'var(--advise-critical)', 'var(--advise-high)', 'var(--advise-indigo)', '#22c55e'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= strength ? colors[strength] : 'var(--border)' }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[strength] }}>{labels[strength]}</p>
    </div>
  );
}

export function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const canSubmit = form.name && emailValid && form.company && form.password.length >= 8 && agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1200));
    if (form.email === 'existing@example.com') {
      setError('Email sudah terdaftar. Coba masuk atau gunakan email lain.');
      setLoading(false);
      return;
    }
    localStorage.setItem('advise_auth', '1');
    router.push('/onboarding');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12" style={{ background: 'var(--advise-navy)' }}>
        <div className="max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ background: 'var(--advise-indigo)' }}>
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-white mb-3" style={{ fontSize: 26, fontWeight: 700 }}>Mulai gratis hari ini</h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Tidak perlu kartu kredit. Setup dalam 60 detik.
          </p>
          <div className="space-y-3 text-left">
            {[
              '✓ Scan DAST otomatis tanpa setup ribet',
              '✓ Laporan PDF siap kirim ke klien',
              '✓ Harga dalam Rupiah, bukan USD',
              '✓ Panduan remediasi untuk developer junior',
            ].map((item, i) => (
              <p key={i} className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{item}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: 'var(--advise-navy)' }}>
              <Shield size={18} className="text-white" />
            </div>
            <span style={{ color: 'var(--advise-navy)', fontWeight: 700, fontSize: 20 }}>ADVISE</span>
          </div>

          <h1 className="mb-1" style={{ color: 'var(--advise-navy)', fontSize: 24, fontWeight: 700 }}>Buat Akun Gratis</h1>
          <p className="mb-6 text-sm" style={{ color: 'var(--advise-steel)' }}>Mulai scan pertamamu dalam 60 detik</p>

          {error && (
            <div className="p-3 mb-4 rounded-lg text-sm" style={{ background: 'var(--advise-critical-bg)', color: 'var(--advise-critical)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Nama Lengkap', placeholder: 'Budi Santoso', type: 'text' },
              { key: 'email', label: 'Email Kerja', placeholder: 'budi@perusahaan.com', type: 'email' },
              { key: 'company', label: 'Nama Perusahaan / Tim', placeholder: 'PT Software House Indonesia', type: 'text' },
            ].map(field => (
              <div key={field.key}>
                <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
                />
              </div>
            ))}

            <div>
              <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 8 karakter"
                  className="w-full px-4 py-2.5 pr-11 rounded-lg border text-sm outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--advise-steel)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrengthBar password={form.password} />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>
                Saya menyetujui{' '}
                <a href="#" style={{ color: 'var(--advise-indigo)' }}>Syarat & Ketentuan</a>
                {' '}dan{' '}
                <a href="#" style={{ color: 'var(--advise-indigo)' }}>Kebijakan Privasi</a>
              </span>
            </label>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--advise-low-bg)' }}>
              <span style={{ fontSize: 14 }}>🎁</span>
              <span className="text-xs" style={{ color: 'var(--advise-low)' }}>Tidak perlu kartu kredit — gratis 14 hari penuh</span>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full py-2.5 rounded-lg text-white text-sm"
              style={{
                background: canSubmit && !loading ? 'var(--advise-indigo)' : 'var(--advise-steel)',
                cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                fontWeight: 600,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Membuat akun...
                </span>
              ) : 'Buat Akun Gratis'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--advise-steel)' }}>
            Sudah punya akun?{' '}
            <Link href="/" style={{ color: 'var(--advise-indigo)', fontWeight: 600 }}>Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
