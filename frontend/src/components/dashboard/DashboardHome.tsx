"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, AlertTriangle, ArrowUpRight, Target, Clock, ArrowRight, CheckCircle, XCircle, Play, TrendingDown, Shield, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { mockScans, mockTargets, type Severity, type ScanStatus } from '../../mockData';

const trendData = [
  { week: 'W1', critical: 3, high: 6, medium: 5 },
  { week: 'W2', critical: 2, high: 5, medium: 4 },
  { week: 'W3', critical: 2, high: 4, medium: 4 },
  { week: 'W4', critical: 1, high: 3, medium: 2 },
];

const SEV_COLORS: Record<Severity, string> = {
  Critical: '#C0392B', High: '#D97706', Medium: '#B7891A', Low: '#2563EB',
};

function SeverityBadge({ severity }: { severity: Severity | null }) {
  if (!severity) return <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>—</span>;
  const color = SEV_COLORS[severity];
  const bg = { Critical: 'var(--advise-critical-bg)', High: 'var(--advise-high-bg)', Medium: 'var(--advise-medium-bg)', Low: 'var(--advise-low-bg)' }[severity];
  return <span className="inline-flex px-2 py-0.5 rounded-full text-xs" style={{ fontWeight: 700, background: bg, color }}>{severity}</span>;
}

function StatusBadge({ status }: { status: ScanStatus }) {
  const map: Record<ScanStatus, { label: string; color: string; bg: string }> = {
    Running: { label: 'Berjalan', color: '#2563EB', bg: '#EFF6FF' },
    Completed: { label: 'Selesai', color: '#16A34A', bg: '#F0FDF4' },
    Failed: { label: 'Gagal', color: 'var(--advise-critical)', bg: 'var(--advise-critical-bg)' },
  };
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ fontWeight: 600, background: s.bg, color: s.color }}>
      {status === 'Running' && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />}
      {s.label}
    </span>
  );
}

export function DashboardHome() {
  const router = useRouter();
  const [activeChart, setActiveChart] = useState<'critical' | 'high' | 'medium'>('critical');

  const totalCritical = mockScans.filter(s => s.status === 'Completed').reduce((a, s) => a + s.summary.critical, 0);
  const totalHigh = mockScans.filter(s => s.status === 'Completed').reduce((a, s) => a + s.summary.high, 0);
  const totalVulns = mockScans.filter(s => s.status === 'Completed').reduce((a, s) => a + s.summary.total, 0);

  const donutData = [
    { name: 'Critical', value: totalCritical },
    { name: 'High', value: totalHigh },
    { name: 'Medium', value: 2 },
    { name: 'Low', value: 1 },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-full" style={{ background: '#F8F7F4' }}>
      {/* Top Search Bar */}
      <div className="px-6 py-3 border-b bg-white flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--advise-steel)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search vulnerabilities, IPs, or scan IDs..."
              className="w-full pl-9 pr-4 py-2 text-sm outline-none rounded-xl"
              style={{ background: 'var(--muted)', color: 'var(--advise-navy)', border: 'none' }}
              onClick={() => router.push('/dashboard/scans')}
              readOnly
            />
          </div>
        </div>
        <button
          onClick={() => router.push('/dashboard/results/s1')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: '#EEF2FF', color: 'var(--advise-indigo)', fontWeight: 700 }}>
          Risk Radar
          <ArrowUpRight size={14} />
        </button>
        <Link href="/dashboard/scan"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ background: 'var(--advise-indigo)', fontWeight: 700 }}>
          <Plus size={14} /> New Scan
        </Link>
      </div>

      <div className="p-5">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Findings', value: totalVulns, icon: '📊', color: 'var(--advise-navy)', sub: 'Semua scan', trend: null },
              { label: 'Critical', value: totalCritical, icon: '🔴', color: 'var(--advise-critical)', sub: 'Perlu patch segera', trend: -1 },
              { label: 'High', value: totalHigh, icon: '🟠', color: 'var(--advise-high)', sub: 'Prioritas tinggi', trend: 0 },
              { label: 'Medium', value: 2, icon: '🟡', color: 'var(--advise-medium)', sub: 'Perlu perhatian', trend: -2 },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border hover:shadow-sm transition-all cursor-pointer"
                style={{ borderColor: 'var(--border)' }}
                onClick={() => i > 0 && router.push('/dashboard/results/s1')}>
                <div className="flex items-start justify-between mb-3">
                  <span style={{ fontSize: 24 }}>{card.icon}</span>
                  {card.trend !== null && (
                    <div className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: card.trend < 0 ? '#F0FDF4' : card.trend > 0 ? 'var(--advise-critical-bg)' : 'var(--muted)', color: card.trend < 0 ? '#16A34A' : card.trend > 0 ? 'var(--advise-critical)' : 'var(--advise-steel)', fontWeight: 600 }}>
                      {card.trend < 0 ? '↓' : card.trend > 0 ? '↑' : '→'} {Math.abs(card.trend)}
                    </div>
                  )}
                </div>
                <p style={{ fontSize: 36, fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{card.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--advise-steel)' }}>{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Left: Donut */}
            <div className="lg:col-span-2 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="px-5 pt-5 pb-2 flex items-center justify-between">
                <h2 style={{ color: 'var(--advise-navy)', fontSize: 15, fontWeight: 700 }}>Risk Distribution</h2>
                <Link href="/dashboard/results/s1" className="text-xs flex items-center gap-1" style={{ color: 'var(--advise-indigo)' }}>
                  Detail <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="flex justify-center py-2">
                <div className="relative" style={{ width: 180, height: 180 }}>
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie data={donutData} cx="50%" cy="50%" innerRadius={62} outerRadius={84} paddingAngle={3} dataKey="value"
                        onClick={(d) => router.push('/dashboard/results/s1')}>
                        {donutData.map(entry => (
                          <Cell key={entry.name} fill={SEV_COLORS[entry.name as Severity]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--advise-navy)' }}>{totalVulns}</span>
                    <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>Findings</span>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5 space-y-2">
                {donutData.map(d => {
                  const pct = Math.round((d.value / totalVulns) * 100);
                  return (
                    <div key={d.name} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: SEV_COLORS[d.name as Severity] }} />
                      <span className="text-sm flex-1" style={{ color: 'var(--advise-navy)' }}>{d.name}</span>
                      <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: SEV_COLORS[d.name as Severity] }} />
                      </div>
                      <span className="text-sm w-6 text-right" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>{d.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Vulnerability Log */}
            <div className="lg:col-span-3 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 style={{ color: 'var(--advise-navy)', fontSize: 15, fontWeight: 700 }}>Vulnerability Log</h2>
                <Link href="/dashboard/results/s1/vulnerabilities" className="flex items-center gap-1 text-sm" style={{ color: 'var(--advise-indigo)', fontWeight: 600 }}>
                  View All <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="grid px-4 py-2" style={{ gridTemplateColumns: '80px 1fr 120px 60px', borderBottom: '1px solid var(--border)' }}>
                {['RISK', 'VULNERABILITY', 'TARGET', 'STATUS'].map(h => (
                  <span key={h} className="text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 700, letterSpacing: '0.05em' }}>{h}</span>
                ))}
              </div>
              {mockScans[0].vulnerabilities.slice(0, 5).map(vuln => {
                const s = { Critical: '#C0392B', High: '#D97706', Medium: '#B7891A', Low: '#2563EB' }[vuln.severity];
                const bg = { Critical: 'var(--advise-critical-bg)', High: 'var(--advise-high-bg)', Medium: 'var(--advise-medium-bg)', Low: 'var(--advise-low-bg)' }[vuln.severity];
                return (
                  <div key={vuln.id}
                    className="grid px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors border-b"
                    style={{ gridTemplateColumns: '80px 1fr 120px 60px', borderColor: 'var(--border)' }}
                    onClick={() => router.push(`/dashboard/results/s1/vulnerabilities`)}>
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: bg, color: s }}>
                        {vuln.severity.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{vuln.name}</p>
                      {vuln.cve && <p className="text-xs font-mono" style={{ color: 'var(--advise-steel)' }}>{vuln.cve}</p>}
                    </div>
                    <div>
                      <p className="text-xs font-mono truncate" style={{ color: 'var(--advise-steel)' }}>staging.client-web.com</p>
                    </div>
                    <div className="flex items-center">
                      {vuln.status === 'Resolved' ? (
                        <CheckCircle size={14} style={{ color: '#16A34A' }} />
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: bg }}>
                          <AlertTriangle size={11} style={{ color: s }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: Trend + Targets + Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Trend Chart */}
            <div className="md:col-span-1 bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <h2 style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>Tren 4 Minggu</h2>
                <div className="flex gap-1.5">
                  {(['critical', 'high', 'medium'] as const).map(c => (
                    <button key={c}
                      onClick={() => setActiveChart(c)}
                      className="text-xs px-2 py-0.5 rounded-lg capitalize"
                      style={{
                        background: activeChart === c ? (c === 'critical' ? 'var(--advise-critical-bg)' : c === 'high' ? 'var(--advise-high-bg)' : 'var(--advise-medium-bg)') : 'var(--muted)',
                        color: activeChart === c ? (c === 'critical' ? 'var(--advise-critical)' : c === 'high' ? 'var(--advise-high)' : 'var(--advise-medium)') : 'var(--advise-steel)',
                        fontWeight: 600,
                      }}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--advise-navy)' }}>
                  {trendData[3][activeChart]}
                </p>
                <div className="flex items-center gap-1 text-xs mb-1.5" style={{ color: '#16A34A', fontWeight: 600 }}>
                  <TrendingDown size={13} /> turun dari {trendData[0][activeChart]}
                </div>
              </div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--advise-indigo)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--advise-indigo)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--advise-steel)' }} axisLine={false} tickLine={false} />
                    <Area type="monotone" dataKey={activeChart} stroke="var(--advise-indigo)" fill="url(#areaGrad)" strokeWidth={2} dot={{ r: 3, fill: 'var(--advise-indigo)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="md:col-span-1 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>Scan Terbaru</h2>
                <Link href="/dashboard/scans" className="text-xs" style={{ color: 'var(--advise-indigo)' }}>Semua →</Link>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {mockScans.slice(0, 4).map(scan => (
                  <div key={scan.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => scan.status !== 'Failed' && router.push(`/dashboard/results/${scan.id}`)}>
                    <div className="flex-shrink-0">
                      {scan.status === 'Completed' ? <CheckCircle size={15} style={{ color: '#16A34A' }} /> : <XCircle size={15} style={{ color: 'var(--advise-critical)' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--advise-navy)' }}>{scan.targetName}</p>
                      <p className="text-xs flex items-center gap-1" style={{ color: 'var(--advise-steel)' }}>
                        <Clock size={10} />
                        {new Date(scan.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <SeverityBadge severity={scan.highestSeverity} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="md:col-span-1 bg-white rounded-2xl p-4 border space-y-2.5" style={{ borderColor: 'var(--border)' }}>
              <h2 className="mb-3" style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>Aksi Cepat</h2>
              {[
                { icon: Zap, label: 'Mulai Scan Baru', desc: 'Scan target sekarang', to: '/dashboard/scan', color: 'var(--advise-indigo)', primary: true },
                { icon: Target, label: 'Tambah Target', desc: 'Simpan untuk scan berkala', to: '/dashboard/targets', color: 'var(--advise-navy)', primary: false },
                { icon: Shield, label: 'Lihat Risk Radar', desc: 'Hasil scan terbaru', to: '/dashboard/results/s1', color: 'var(--advise-navy)', primary: false },
                { icon: Play, label: 'Bandingkan Scan', desc: 'Tren keamanan', to: '/dashboard/results/s1/compare', color: 'var(--advise-navy)', primary: false },
              ].map(action => (
                <Link key={action.to} href={action.to}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:border-indigo-200 hover:bg-indigo-50 group"
                  style={{ borderColor: 'var(--border)', background: action.primary ? '#EEF2FF' : 'white' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: action.primary ? 'var(--advise-indigo)' : 'var(--muted)' }}>
                    <action.icon size={14} style={{ color: action.primary ? 'white' : 'var(--advise-steel)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{action.label}</p>
                    <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>{action.desc}</p>
                  </div>
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--advise-indigo)' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
