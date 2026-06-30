"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Toaster } from 'sonner';

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailValid && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1200));
    if (email === 'wrong@example.com') {
      setError('Email atau password salah. Silakan coba lagi.');
      setLoading(false);
      return;
    }
    localStorage.setItem('advise_auth', '1');
    router.push('/dashboard');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster position="top-right" richColors />

      {/* Left Panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: 'var(--advise-navy)' }}>
              <Shield size={20} className="text-white" />
            </div>
            <span style={{ color: 'var(--advise-navy)', fontWeight: 700, fontSize: 22 }}>ADVISE</span>
          </div>

          <h1 className="mb-1" style={{ color: 'var(--advise-navy)', fontSize: 28, fontWeight: 700, lineHeight: 1.3 }}>
            Selamat datang kembali
          </h1>
          <p className="mb-8 text-sm" style={{ color: 'var(--advise-steel)' }}>
            Masuk untuk melanjutkan sesi keamanan Anda
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-lg border text-sm" style={{ background: 'var(--advise-critical-bg)', borderColor: 'var(--advise-critical)', color: 'var(--advise-critical)' }}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="nama@perusahaan.com"
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                style={{
                  borderColor: emailTouched && email && !emailValid ? 'var(--advise-critical)' : 'var(--border)',
                  color: 'var(--advise-navy)',
                  background: 'var(--input-background)',
                }}
              />
              {emailTouched && email && !emailValid && (
                <p className="mt-1 text-xs" style={{ color: 'var(--advise-critical)' }}>Format email tidak valid</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Password</label>
                <a href="#" className="text-xs" style={{ color: 'var(--advise-indigo)' }}>Lupa password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full px-4 py-2.5 pr-11 rounded-lg border text-sm outline-none transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--advise-navy)',
                    background: 'var(--input-background)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--advise-steel)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full py-2.5 rounded-lg text-white text-sm transition-opacity"
              style={{
                background: canSubmit && !loading ? 'var(--advise-indigo)' : 'var(--advise-steel)',
                cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                fontWeight: 600,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Masuk...
                </span>
              ) : 'Masuk'}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>atau</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            <button
              type="button"
              className="w-full py-2.5 rounded-lg border text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Masuk dengan Google Workspace
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: 'var(--advise-steel)' }}>
            Belum punya akun?{' '}
            <Link href="/register" style={{ color: 'var(--advise-indigo)', fontWeight: 600 }}>Daftar gratis</Link>
          </p>

          <p className="mt-4 text-center" style={{ fontSize: 11, color: 'var(--advise-steel)' }}>
            Demo: gunakan email apapun + password 6+ karakter
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden" style={{ background: 'var(--advise-navy)' }}>
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/20"
              style={{
                width: 40 + i * 30,
                height: 40 + i * 30,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8" style={{ background: 'var(--advise-indigo)' }}>
            <Shield size={40} className="text-white" />
          </div>
          <h2 className="text-white mb-4" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.3 }}>
            Scan keamanan sehari, bukan seminggu
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            DAST otomatis untuk software house Indonesia. Temukan kerentanan di aplikasi klien sebelum penjahat siber menemukannya.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: '7 detik', label: 'Setup awal' },
              { value: '98%', label: 'Akurasi deteksi' },
              { value: 'Rp 0', label: 'Biaya awal' },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <p className="text-white mb-1" style={{ fontWeight: 700, fontSize: 20 }}>{stat.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
