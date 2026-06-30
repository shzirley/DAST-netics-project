"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap, Shield, Globe, ChevronRight, Clock, Target,
  Settings, CheckCircle2, AlertTriangle, Info, ArrowRight, Play, Search
} from 'lucide-react';
import { mockTargets } from '../../mockData';
import { toast } from 'sonner';

const SCAN_MODES = [
  {
    id: 'quick',
    icon: Zap,
    label: 'Quick Scan',
    duration: '~2 menit',
    desc: 'Temukan kerentanan kritis paling umum. Ideal untuk pre-deployment check cepat.',
    checks: ['OWASP Top 10 basics', 'SQL Injection', 'XSS', 'Auth bypass'],
    color: '#16A34A',
    bg: '#F0FDF4',
    borderActive: '#16A34A',
  },
  {
    id: 'standard',
    icon: Shield,
    label: 'Standard Scan',
    duration: '~5 menit',
    desc: 'Coverage penuh OWASP Top 10 dengan pengujian endpoint mendalam.',
    checks: ['Semua Quick Scan', 'IDOR & CSRF', 'Security headers', 'Session management'],
    color: '#4B5694',
    bg: '#EEF2FF',
    borderActive: '#4B5694',
    recommended: true,
  },
  {
    id: 'deep',
    icon: Globe,
    label: 'Deep Scan',
    duration: '~15 menit',
    desc: 'Analisis komprehensif termasuk business logic & advanced attack vectors.',
    checks: ['Semua Standard Scan', 'Business logic flaws', 'API fuzzing', 'XXE & SSRF'],
    color: '#7C3AED',
    bg: '#F5F3FF',
    borderActive: '#7C3AED',
  },
];

const RECENT_TARGETS = [
  { name: 'staging.client-web.com', env: 'Staging', lastScan: '2j lalu', severity: 'Critical' },
  { name: 'api.ecommerce.com', env: 'Production', lastScan: '1h lalu', severity: 'High' },
  { name: 'dev.dashboard.internal', env: 'Dev', lastScan: '3h lalu', severity: 'Medium' },
  { name: 'beta.newapp.com', env: 'Staging', lastScan: '1d lalu', severity: null },
];

const CHECKS_LIST = [
  { done: true, label: 'OWASP Top 10 vulnerabilities' },
  { done: true, label: 'Authentication & authorization flaws' },
  { done: true, label: 'Injection attacks (SQL, NoSQL, Command)' },
  { done: true, label: 'Cross-site scripting (XSS)' },
  { done: false, label: 'Business logic flaws (Deep only)' },
  { done: false, label: 'API security testing (Standard+)' },
];

function SeverityDot({ severity }: { severity: string | null }) {
  const colors: Record<string, string> = {
    Critical: '#C0392B', High: '#D97706', Medium: '#B7891A', Low: '#2563EB',
  };
  if (!severity) return <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />;
  return <span className="w-2 h-2 rounded-full inline-block" style={{ background: colors[severity] }} />;
}

function EnvBadge({ env }: { env: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Production: { bg: '#FEF2F2', color: '#DC2626' },
    Staging: { bg: '#FFFBEB', color: '#D97706' },
    Dev: { bg: '#F0FDF4', color: '#16A34A' },
  };
  const s = map[env] ?? { bg: 'var(--muted)', color: 'var(--advise-steel)' };
  return <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: s.bg, color: s.color, fontWeight: 600 }}>{env}</span>;
}

export function RapidScanGateway() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [urlValid, setUrlValid] = useState(false);
  const [selectedMode, setSelectedMode] = useState('standard');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [excludePaths, setExcludePaths] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validateUrl = (val: string) => {
    if (!val) return { error: '', valid: false };
    const full = val.startsWith('http') ? val : `https://${val}`;
    try {
      const u = new URL(full);
      if (['http:', 'https:'].includes(u.protocol)) return { error: '', valid: true };
      return { error: 'Gunakan protokol https:// atau http://', valid: false };
    } catch {
      return { error: 'Format URL tidak valid', valid: false };
    }
  };

  const handleUrlChange = (val: string) => {
    setUrl(val);
    const { error, valid } = validateUrl(val);
    setUrlError(error);
    setUrlValid(valid);
  };

  const handleSelectTarget = (target: typeof RECENT_TARGETS[0]) => {
    const u = `https://${target.name}`;
    setUrl(u);
    setUrlError('');
    setUrlValid(true);
    toast.success(`Target ${target.name} dipilih`);
  };

  const handleSubmit = async () => {
    const { error, valid } = validateUrl(url);
    if (!valid) { setUrlError(error || 'URL wajib diisi'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    router.push(`/dashboard/scan/monitor?url=${encodeURIComponent(url.startsWith('http') ? url : ('https://' + url))}&scanDepth=${selectedMode}`);
  };

  return (
    <div className="min-h-full" style={{ background: '#F8F7F4' }}>
      {/* Top Header Bar */}
      <div className="px-6 py-4 border-b bg-white flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--advise-indigo)' }}>
            <Zap size={13} className="text-white" />
          </div>
          <span style={{ color: 'var(--advise-navy)', fontWeight: 700, fontSize: 15 }}>RapidScan</span>
        </div>
        <ChevronRight size={14} style={{ color: 'var(--advise-steel)' }} />
        <span className="text-sm" style={{ color: 'var(--advise-steel)' }}>New Scan</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: '#F0FDF4', color: '#16A34A' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#16A34A' }} />
            Scanner aktif
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Left Column — URL + Mode */}
            <div className="lg:col-span-3 space-y-5">
              {/* URL Input Card */}
              <div className="bg-white rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, #111844 0%, #1e2d6b 100%)' }}>
                  <h2 className="text-white" style={{ fontWeight: 700, fontSize: 16 }}>Target URL</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Masukkan URL aplikasi yang akan discan</p>
                </div>
                <div className="p-5">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Globe size={16} style={{ color: urlValid ? '#16A34A' : urlError ? 'var(--advise-critical)' : 'var(--advise-steel)' }} />
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={e => handleUrlChange(e.target.value)}
                      placeholder="https://staging.client-web.com"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all font-mono"
                      style={{
                        borderColor: urlValid ? '#16A34A' : urlError ? 'var(--advise-critical)' : 'var(--border)',
                        color: 'var(--advise-navy)',
                        background: urlValid ? '#F0FDF4' : urlError ? '#FEF2F2' : 'var(--input-background)',
                        boxShadow: urlValid ? '0 0 0 3px rgba(22,163,74,0.1)' : urlError ? '0 0 0 3px rgba(192,57,43,0.1)' : 'none',
                        fontSize: 14,
                      }}
                    />
                    {urlValid && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 size={16} style={{ color: '#16A34A' }} />
                      </div>
                    )}
                  </div>
                  {urlError && (
                    <p className="mt-2 text-xs flex items-center gap-1" style={{ color: 'var(--advise-critical)' }}>
                      <AlertTriangle size={11} /> {urlError}
                    </p>
                  )}
                  {urlValid && (
                    <p className="mt-2 text-xs flex items-center gap-1.5" style={{ color: '#16A34A' }}>
                      <CheckCircle2 size={11} /> Target valid dan siap untuk discan
                    </p>
                  )}

                  {/* Protocol hint */}
                  {!url && (
                    <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: 'var(--advise-steel)' }}>
                      <span>Contoh:</span>
                      {['https://app.com', 'https://api.staging.io', 'http://10.0.0.1:3000'].map(ex => (
                        <button
                          key={ex}
                          onClick={() => handleUrlChange(ex)}
                          className="px-2 py-1 rounded-lg transition-colors hover:bg-gray-100 font-mono"
                          style={{ color: 'var(--advise-indigo)' }}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Scan Mode Cards */}
              <div>
                <p className="mb-3 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>Mode Scan</p>
                <div className="grid grid-cols-3 gap-3">
                  {SCAN_MODES.map(mode => {
                    const active = selectedMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id)}
                        className="relative text-left rounded-2xl p-4 border-2 transition-all"
                        style={{
                          borderColor: active ? mode.borderActive : 'var(--border)',
                          background: active ? mode.bg : 'white',
                          transform: active ? 'translateY(-2px)' : 'none',
                          boxShadow: active ? `0 8px 24px ${mode.color}20` : 'none',
                        }}
                      >
                        {mode.recommended && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full text-white whitespace-nowrap" style={{ background: mode.color, fontWeight: 700 }}>
                            Rekomendasi
                          </span>
                        )}
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: active ? mode.color : 'var(--muted)' }}>
                          <mode.icon size={18} style={{ color: active ? 'white' : 'var(--advise-steel)' }} />
                        </div>
                        <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>{mode.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: mode.color, fontWeight: 600 }}>{mode.duration}</p>
                        <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--advise-steel)' }}>{mode.desc}</p>
                        <ul className="mt-3 space-y-1">
                          {mode.checks.slice(0, 3).map(c => (
                            <li key={c} className="text-xs flex items-center gap-1.5" style={{ color: active ? mode.color : 'var(--advise-steel)' }}>
                              <CheckCircle2 size={10} /> {c}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Settings size={15} style={{ color: 'var(--advise-steel)' }} />
                    <span className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Advanced Settings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--muted)', color: 'var(--advise-steel)' }}>Opsional</span>
                    <ChevronRight size={15} className="transition-transform" style={{ color: 'var(--advise-steel)', transform: showAdvanced ? 'rotate(90deg)' : 'none' }} />
                  </div>
                </button>
                {showAdvanced && (
                  <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-1 mb-1.5 text-xs" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>
                          Auth Token / Cookie
                          <Info size={11} style={{ color: 'var(--advise-steel)' }} />
                        </label>
                        <input
                          type="text"
                          value={authToken}
                          onChange={e => setAuthToken(e.target.value)}
                          placeholder="Bearer eyJ..."
                          className="w-full px-3 py-2 rounded-xl border text-xs outline-none font-mono"
                          style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
                        />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-xs" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Max Concurrent Requests</label>
                        <select className="w-full px-3 py-2 rounded-xl border text-xs outline-none" style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)' }}>
                          <option>10 (Default)</option>
                          <option>25</option>
                          <option>50</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1.5 text-xs" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Exclude Paths (satu per baris)</label>
                      <textarea
                        value={excludePaths}
                        onChange={e => setExcludePaths(e.target.value)}
                        placeholder="/logout&#10;/admin&#10;/api/webhook"
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl border text-xs outline-none font-mono resize-none"
                        style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-98"
                style={{
                  background: submitting ? 'var(--advise-steel)' : 'linear-gradient(135deg, #4B5694 0%, #111844 100%)',
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: '0 8px 24px rgba(75,86,148,0.35)',
                }}
              >
                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyiapkan scan...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Mulai Security Scan
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Right Column — Info & Targets */}
            <div className="lg:col-span-2 space-y-5">
              {/* Recent Targets */}
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <Clock size={13} style={{ color: 'var(--advise-steel)' }} />
                    <span className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>Target Tersimpan</span>
                  </div>
                  <button onClick={() => router.push('/dashboard/targets')} className="text-xs" style={{ color: 'var(--advise-indigo)' }}>
                    Kelola →
                  </button>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {RECENT_TARGETS.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectTarget(t)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--muted)' }}>
                        <Target size={14} style={{ color: 'var(--advise-indigo)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <SeverityDot severity={t.severity} />
                          <p className="text-xs font-mono truncate" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{t.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <EnvBadge env={t.env} />
                          <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>{t.lastScan}</span>
                        </div>
                      </div>
                      <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: 'var(--advise-indigo)' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* What will be tested */}
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, #111844 0%, #1e2d6b 100%)' }}>
                  <p className="text-sm text-white" style={{ fontWeight: 700 }}>Yang Akan Diuji</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {selectedMode === 'quick' ? 'Quick' : selectedMode === 'standard' ? 'Standard' : 'Deep'} mode
                  </p>
                </div>
                <div className="p-4 space-y-2">
                  {SCAN_MODES.find(m => m.id === selectedMode)!.checks.map(check => (
                    <div key={check} className="flex items-center gap-2.5">
                      <CheckCircle2 size={13} style={{ color: '#16A34A', flexShrink: 0 }} />
                      <span className="text-xs" style={{ color: 'var(--advise-navy)' }}>{check}</span>
                    </div>
                  ))}
                  {CHECKS_LIST.filter(c => !c.done).map(c => (
                    <div key={c.label} className="flex items-center gap-2.5 opacity-40">
                      <div className="w-3 h-3 rounded-full border flex-shrink-0" style={{ borderColor: 'var(--advise-steel)' }} />
                      <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: '312+', label: 'Test Cases' },
                  { val: '98%', label: 'Akurasi' },
                  { val: '0', label: 'Setup diperlukan' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-3 text-center border" style={{ borderColor: 'var(--border)' }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--advise-navy)' }}>{s.val}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--advise-steel)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
