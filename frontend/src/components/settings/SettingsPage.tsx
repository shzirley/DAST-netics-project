"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';import { User, CreditCard, Bell, Code, Copy, Eye, EyeOff, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'profile' | 'billing' | 'notifications' | 'api';

function ProfileTab() {
  const [form, setForm] = useState({ name: 'Andi Prakoso', email: 'andi@softwarehouse.id', company: 'PT Software House Indonesia', language: 'id' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success('Profil berhasil disimpan');
  };

  return (
    <div className="max-w-lg space-y-5">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl"
          style={{ background: 'var(--advise-indigo)', fontWeight: 700 }}>
          AP
        </div>
        <div>
          <p style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{form.name}</p>
          <button className="text-xs mt-1" style={{ color: 'var(--advise-indigo)' }}>Ganti foto profil</button>
        </div>
      </div>

      {[
        { key: 'name', label: 'Nama Lengkap', type: 'text' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'company', label: 'Nama Perusahaan / Tim', type: 'text' },
      ].map(f => (
        <div key={f.key}>
          <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{f.label}</label>
          <input
            type={f.type}
            value={form[f.key as keyof typeof form]}
            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
          />
        </div>
      ))}

      <div>
        <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Bahasa Preferensi</label>
        <select
          value={form.language}
          onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
        >
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm mb-3" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Ubah Password</p>
        <div className="space-y-3">
          {['Password Saat Ini', 'Password Baru', 'Konfirmasi Password Baru'].map((label, i) => (
            <div key={i}>
              <label className="block mb-1 text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>{label}</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 rounded-xl text-white text-sm"
        style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
      >
        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </div>
  );
}

function BillingTab() {
  const plans = [
    { name: 'Free Trial', price: 'Gratis', period: '14 hari', features: ['5 scan/bulan', '1 target', '1 anggota tim', 'Email support'], current: false },
    { name: 'Pay-per-Scan', price: 'Rp 150.000', period: '/scan', features: ['Scan tak terbatas', '10 target', '5 anggota tim', 'PDF export', 'Priority support'], current: true },
    { name: 'Tim', price: 'Rp 2.500.000', period: '/bulan', features: ['Scan tak terbatas', 'Target tak terbatas', 'Anggota tak terbatas', 'CI/CD integration', 'SLA support'], current: false },
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan Banner */}
      <div className="p-4 rounded-2xl border" style={{ background: '#EEF2FF', borderColor: 'var(--advise-indigo)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ fontWeight: 600, color: 'var(--advise-indigo)' }}>Plan Aktif: Pay-per-Scan</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--advise-steel)' }}>Digunakan 3 scan bulan ini</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'white', color: 'var(--advise-indigo)', fontWeight: 600 }}>Aktif</span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.name} className="bg-white rounded-2xl p-5 border"
            style={{ borderColor: plan.current ? 'var(--advise-indigo)' : 'var(--border)', outline: plan.current ? '2px solid var(--advise-indigo)' : 'none' }}>
            {plan.current && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-3" style={{ background: '#EEF2FF', color: 'var(--advise-indigo)', fontWeight: 600 }}>
                <Check size={10} /> Plan Aktif
              </span>
            )}
            <h3 style={{ color: 'var(--advise-navy)', fontSize: 15, fontWeight: 700 }}>{plan.name}</h3>
            <div className="flex items-baseline gap-1 my-2">
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--advise-navy)' }}>{plan.price}</span>
              <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>{plan.period}</span>
            </div>
            <ul className="space-y-1.5 mb-4">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--advise-steel)' }}>
                  <Check size={12} style={{ color: '#16A34A' }} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => !plan.current && toast.info('Mengarahkan ke halaman pembayaran...')}
              className="w-full py-2 rounded-xl text-sm"
              style={{
                background: plan.current ? 'var(--muted)' : 'var(--advise-indigo)',
                color: plan.current ? 'var(--advise-steel)' : 'white',
                fontWeight: 600,
                cursor: plan.current ? 'default' : 'pointer',
              }}
            >
              {plan.current ? 'Plan Aktif' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Invoice History */}
      <div>
        <h3 className="mb-3" style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>Riwayat Invoice</h3>
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          {[
            { date: '28 Jun 2026', desc: 'Pay-per-Scan × 3', amount: 'Rp 450.000', status: 'Lunas' },
            { date: '15 Jun 2026', desc: 'Pay-per-Scan × 2', amount: 'Rp 300.000', status: 'Lunas' },
            { date: '1 Jun 2026', desc: 'Pay-per-Scan × 1', amount: 'Rp 150.000', status: 'Lunas' },
          ].map((inv, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 500 }}>{inv.desc}</p>
                <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>{inv.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{inv.amount}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F0FDF4', color: '#16A34A', fontWeight: 600 }}>{inv.status}</span>
                <button className="text-xs" style={{ color: 'var(--advise-indigo)' }}>Unduh</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    scanDone: { email: true, inapp: true },
    scanFailed: { email: true, inapp: true },
    ticketAssigned: { email: false, inapp: true },
    criticalFound: { email: true, inapp: true },
    weeklyReport: { email: true, inapp: false },
  });

  const notifItems = [
    { key: 'scanDone', label: 'Scan Selesai', desc: 'Notifikasi saat scan berhasil diselesaikan' },
    { key: 'scanFailed', label: 'Scan Gagal', desc: 'Alert saat scan gagal dijalankan' },
    { key: 'ticketAssigned', label: 'Ticket Di-assign', desc: 'Saat kerentanan di-assign ke kamu' },
    { key: 'criticalFound', label: 'Kerentanan Critical Baru', desc: 'Alert segera saat Critical ditemukan' },
    { key: 'weeklyReport', label: 'Laporan Mingguan', desc: 'Ringkasan keamanan semua proyek tiap Senin' },
  ];

  return (
    <div className="max-w-lg space-y-4">
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-3 px-5 py-3 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>Notifikasi</span>
          <span className="text-center" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>Email</span>
          <span className="text-center" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>In-app</span>
        </div>
        {notifItems.map(item => {
          const s = settings[item.key as keyof typeof settings];
          return (
            <div key={item.key} className="grid grid-cols-3 items-center px-5 py-4 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{item.label}</p>
                <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>{item.desc}</p>
              </div>
              {(['email', 'inapp'] as const).map(channel => (
                <div key={channel} className="flex justify-center">
                  <div
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      [item.key]: { ...prev[item.key as keyof typeof prev], [channel]: !prev[item.key as keyof typeof prev][channel] }
                    }))}
                    className="relative w-9 h-5 rounded-full transition-colors cursor-pointer"
                    style={{ background: s[channel] ? 'var(--advise-indigo)' : 'var(--switch-background)' }}
                  >
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                      style={{ transform: s[channel] ? 'translateX(16px)' : 'translateX(0)' }} />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <button onClick={() => toast.success('Pengaturan notifikasi disimpan')}
        className="px-6 py-2.5 rounded-xl text-white text-sm" style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}>
        Simpan Pengaturan
      </button>
    </div>
  );
}

function ApiTab() {
  const [apiKey, setApiKey] = useState('adv_live_sk_8f7a3b2c1d9e6f4a5b8c7d2e1f0a9b6c');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  const masked = `adv_live_sk_${'•'.repeat(28)}`;

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    toast.success('API Key disalin!');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const regenerate = () => {
    setApiKey(`adv_live_sk_${Math.random().toString(36).substring(2, 34)}`);
    toast.success('API Key baru digenerate. Perbarui di semua integrasi Anda.');
  };

  const snippets = {
    curl: `curl -X POST https://api.advise.app/v1/scans \\
  -H "Authorization: Bearer ${masked}" \\
  -H "Content-Type: application/json" \\
  -d '{"target_url": "https://staging.app.com", "scan_depth": "standard"}'`,
    github: `# .github/workflows/security-scan.yml
name: ADVISE Security Scan
on: [push]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - name: Run ADVISE Scan
        run: |
          curl -X POST https://api.advise.app/v1/scans \\
            -H "Authorization: Bearer \${{ secrets.ADVISE_API_KEY }}" \\
            -d '{"target_url": "\${{ env.STAGING_URL }}"}'`,
    gitlab: `# .gitlab-ci.yml
security-scan:
  stage: test
  script:
    - |
      curl -X POST https://api.advise.app/v1/scans \\
        -H "Authorization: Bearer $ADVISE_API_KEY" \\
        -d "{\"target_url\": \"$STAGING_URL\"}"`,
  };

  const [activeSnippet, setActiveSnippet] = useState<'curl' | 'github' | 'gitlab'>('curl');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const copySnippet = () => {
    navigator.clipboard.writeText(snippets[activeSnippet]);
    setCopiedSnippet(true);
    toast.success('Snippet disalin!');
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* API Key */}
      <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)' }}>
        <h3 className="mb-4" style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>API Key</h3>
        <div className="flex items-center gap-2 p-3 rounded-xl border font-mono" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          <span className="flex-1 text-sm truncate" style={{ color: 'var(--advise-navy)' }}>
            {showKey ? apiKey : masked}
          </span>
          <button onClick={() => setShowKey(!showKey)} className="p-1" style={{ color: 'var(--advise-steel)' }}>
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={copyKey} className="p-1" style={{ color: 'var(--advise-steel)' }}>
            {copiedKey ? <Check size={14} style={{ color: '#16A34A' }} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={regenerate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs"
            style={{ borderColor: 'var(--border)', color: 'var(--advise-critical)', fontWeight: 600 }}
          >
            <RefreshCw size={12} /> Regenerate Key
          </button>
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--advise-steel)' }}>
          ⚠ Jangan bagikan API key. Regenerate jika kompromis.
        </p>
      </div>

      {/* Code Snippets */}
      <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)' }}>
        <h3 className="mb-3" style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>Contoh Integrasi</h3>
        <div className="flex gap-2 mb-3">
          {(['curl', 'github', 'gitlab'] as const).map(s => (
            <button
              key={s}
              onClick={() => setActiveSnippet(s)}
              className="px-3 py-1.5 rounded-lg border text-xs capitalize transition-colors"
              style={{
                borderColor: activeSnippet === s ? 'var(--advise-indigo)' : 'var(--border)',
                background: activeSnippet === s ? '#EEF2FF' : 'white',
                color: activeSnippet === s ? 'var(--advise-indigo)' : 'var(--advise-steel)',
                fontWeight: 600,
              }}
            >
              {s === 'github' ? 'GitHub Actions' : s === 'gitlab' ? 'GitLab CI' : 'cURL'}
            </button>
          ))}
        </div>
        <div className="relative rounded-xl overflow-hidden" style={{ background: 'var(--advise-navy)' }}>
          <button
            onClick={copySnippet}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
          >
            {copiedSnippet ? <><Check size={10} /> Disalin!</> : <><Copy size={10} /> Copy</>}
          </button>
          <pre className="p-4 text-xs overflow-x-auto" style={{ color: '#A5F3FC', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>
            {snippets[activeSnippet]}
          </pre>
        </div>
      </div>

      {/* Webhook */}
      <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)' }}>
        <h3 className="mb-3" style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>Webhook (Slack / Jira)</h3>
        <input
          type="url"
          value={webhookUrl}
          onChange={e => setWebhookUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/..."
          className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none font-mono"
          style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
        />
        <button
          onClick={() => toast.success('Webhook disimpan')}
          className="mt-3 px-5 py-2 rounded-xl text-white text-sm"
          style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
        >
          Simpan Webhook
        </button>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const searchParams = useSearchParams();
  const initTab = (searchParams.get('tab') as Tab) ?? 'profile';
  const [activeTab, setActiveTab] = useState<Tab>(initTab);

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'api', label: 'API & CI/CD', icon: Code },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="mb-6" style={{ color: 'var(--advise-navy)', fontSize: 22, fontWeight: 700 }}>Pengaturan</h1>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <nav className="w-44 flex-shrink-0">
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-colors"
                style={{
                  background: activeTab === tab.id ? '#EEF2FF' : 'transparent',
                  color: activeTab === tab.id ? 'var(--advise-indigo)' : 'var(--advise-steel)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                }}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'api' && <ApiTab />}
        </div>
      </div>
    </div>
  );
}
