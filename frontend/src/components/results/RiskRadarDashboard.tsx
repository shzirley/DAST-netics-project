"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Download, GitCompare, ExternalLink,
  AlertTriangle, FileText, ChevronRight, ArrowUpRight, Search
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { mockScans, type Severity, type Vulnerability } from '../../mockData';
import { ActionableInsightsPanel } from './ActionableInsightsPanel';
import { ComplianceExporter } from './ComplianceExporter';

const SEV_CONFIG: Record<Severity, { bg: string; color: string; icon: string; border: string }> = {
  Critical: { bg: 'var(--advise-critical-bg)', color: 'var(--advise-critical)', icon: '🔴', border: '#C0392B' },
  High: { bg: 'var(--advise-high-bg)', color: 'var(--advise-high)', icon: '🟠', border: '#D97706' },
  Medium: { bg: 'var(--advise-medium-bg)', color: 'var(--advise-medium)', icon: '🟡', border: '#B7891A' },
  Low: { bg: 'var(--advise-low-bg)', color: 'var(--advise-low)', icon: '🔵', border: '#2563EB' },
};

function SeverityBadge({ severity }: { severity: Severity | null }) {
  if (!severity) return <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>—</span>;
  const s = SEV_CONFIG[severity];
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs"
      style={{ fontWeight: 700, background: s.bg, color: s.color }}>
      {severity}
    </span>
  );
}

const BASE_THROUGHPUT = 769;
const INIT_CHART_DATA = [
  { t: '0s', v: 0 }, { t: '30s', v: 320 }, { t: '1m', v: 580 },
  { t: '1.5m', v: 720 }, { t: '2m', v: 769 },
];

function GaugeChart({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = (value / max) * 100;
  const radius = 52;
  const circ = Math.PI * radius;
  const dash = (pct / 100) * circ;
  return (
    <svg width={130} height={75} viewBox="0 0 130 75">
      <path d="M 13 70 A 52 52 0 0 1 117 70" fill="none" stroke="#E5E7EB" strokeWidth="9" strokeLinecap="round" />
      <path d="M 13 70 A 52 52 0 0 1 117 70" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} style={{ transition: 'stroke-dasharray 0.8s ease' }} />
    </svg>
  );
}

export function RiskRadarDashboard() {
  const { scanId } = useParams<{ scanId: string }>();
  const router = useRouter();
  const scan = mockScans.find(s => s.id === scanId) ?? mockScans[0];

  const [selectedSeverity, setSelectedSeverity] = useState<Severity | null>(null);
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);
  const [showExporter, setShowExporter] = useState(false);
  const [search, setSearch] = useState('');

  // Live metrics state
  const [throughput, setThroughput] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const [endpointsMapped, setEndpointsMapped] = useState(0);
  const [chartData, setChartData] = useState(INIT_CHART_DATA);
  const tickRef = useRef(0);

  // Count-up animation on mount, then fluctuate
  useEffect(() => {
    // Count up throughput 0 → 769 over 1.5s
    const countDuration = 1500;
    const startTime = Date.now();
    const countUp = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / countDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setThroughput(Math.round(BASE_THROUGHPUT * eased));
      setEndpointsMapped(Math.round(14208 * eased));
      if (progress >= 1) clearInterval(countUp);
    }, 30);

    // Count up coverage 0 → 94.2 over 2s
    const covStart = Date.now();
    const covUp = setInterval(() => {
      const elapsed = Date.now() - covStart;
      const progress = Math.min(elapsed / 2000, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setCoverage(parseFloat((94.2 * eased).toFixed(1)));
      if (progress >= 1) clearInterval(covUp);
    }, 40);

    return () => { clearInterval(countUp); clearInterval(covUp); };
  }, []);

  // Live fluctuation after count-up, and append new chart bars
  useEffect(() => {
    const live = setInterval(() => {
      tickRef.current += 1;
      // Fluctuate throughput ±60 around 769
      const fluctuation = Math.round((Math.random() - 0.5) * 120);
      setThroughput(Math.max(650, Math.min(890, BASE_THROUGHPUT + fluctuation)));

      // Append new data point to chart every 2 ticks
      if (tickRef.current % 2 === 0) {
        const newVal = Math.round(BASE_THROUGHPUT + (Math.random() - 0.5) * 100);
        const label = `+${Math.round(tickRef.current / 2) * 30}s`;
        setChartData(prev => {
          const next = [...prev, { t: label, v: newVal }];
          return next.length > 10 ? next.slice(next.length - 10) : next;
        });
      }

      // Tiny coverage jitter after reaching target
      setCoverage(prev => {
        if (prev >= 94.0) return parseFloat((94.2 + (Math.random() - 0.5) * 0.4).toFixed(1));
        return prev;
      });
    }, 600);

    return () => clearInterval(live);
  }, []);

  const donutData = [
    { name: 'Critical', value: scan.summary.critical },
    { name: 'High', value: scan.summary.high },
    { name: 'Medium', value: scan.summary.medium },
    { name: 'Low', value: scan.summary.low },
  ].filter(d => d.value > 0);

  const filteredVulns = scan.vulnerabilities.filter(v => {
    const matchSev = !selectedSeverity || v.severity === selectedSeverity;
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.path.toLowerCase().includes(search.toLowerCase());
    return matchSev && matchSearch;
  });

  const riskLevel = scan.summary.critical > 0 ? 'Perlu Patch Segera' : scan.summary.high > 2 ? 'Risiko Tinggi' : scan.summary.medium > 0 ? 'Risiko Sedang' : 'Aman';
  const riskColor = scan.summary.critical > 0 ? 'var(--advise-critical)' : scan.summary.high > 0 ? 'var(--advise-high)' : '#16A34A';

  return (
    <div className="min-h-full" style={{ background: '#F8F7F4' }}>
      {/* Top Bar */}
      <div className="px-6 py-3 border-b bg-white flex items-center gap-3 flex-wrap" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-sm hover:opacity-70" style={{ color: 'var(--advise-steel)' }}>
          <ArrowLeft size={14} /> Dashboard
        </button>
        <ChevronRight size={13} style={{ color: 'var(--advise-steel)' }} />
        <span className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{scan.targetName}</span>

        <div className="ml-auto flex items-center gap-2">
          <Link href={`/dashboard/results/${scan.id}/compare`}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', fontWeight: 600 }}>
            <GitCompare size={13} /> Bandingkan
          </Link>
          <Link href={`/dashboard/results/${scan.id}/vulnerabilities`}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border hover:bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', fontWeight: 600 }}>
            <FileText size={13} /> Semua Temuan
          </Link>
          <button onClick={() => setShowExporter(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl text-white" style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}>
            <Download size={13} /> Export PDF
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Summary Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Findings', value: scan.summary.total, color: 'var(--advise-navy)', bg: 'white', sub: `${scan.duration} scan`, icon: '📊' },
              { label: 'Critical', value: scan.summary.critical, color: 'var(--advise-critical)', bg: 'var(--advise-critical-bg)', sub: 'Perlu patch segera', icon: '🔴' },
              { label: 'High', value: scan.summary.high, color: 'var(--advise-high)', bg: 'var(--advise-high-bg)', sub: 'Prioritas tinggi', icon: '🟠' },
              { label: 'Medium', value: scan.summary.medium, color: 'var(--advise-medium)', bg: 'var(--advise-medium-bg)', sub: 'Perlu ditangani', icon: '🟡' },
            ].map((card, i) => (
              <div key={i}
                onClick={() => i > 0 && setSelectedSeverity(prev => prev === (['Critical', 'High', 'Medium'] as Severity[])[i - 1] ? null : (['Critical', 'High', 'Medium'] as Severity[])[i - 1])}
                className="bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all hover:shadow-sm"
                style={{
                  background: card.bg,
                  borderColor: i > 0 && selectedSeverity === (['Critical', 'High', 'Medium'] as Severity[])[i - 1] ? card.color : 'transparent',
                  outline: i > 0 && selectedSeverity === (['Critical', 'High', 'Medium'] as Severity[])[i - 1] ? `2px solid ${card.color}` : '2px solid transparent',
                }}>
                <div className="flex items-start justify-between mb-3">
                  <span style={{ fontSize: 22 }}>{card.icon}</span>
                  <ArrowUpRight size={14} style={{ color: card.color, opacity: 0.5 }} />
                </div>
                <p style={{ fontSize: 34, fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</p>
                <p className="text-sm mt-1" style={{ color: card.color, fontWeight: 600, opacity: 0.8 }}>{card.label}</p>
                <p className="text-xs mt-0.5" style={{ color: card.color, opacity: 0.5 }}>{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Risk Band */}
          <div className="bg-white rounded-2xl px-5 py-3.5 border flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full" style={{ background: riskColor }} />
              <span style={{ color: 'var(--advise-navy)', fontWeight: 700, fontSize: 14 }}>Status Risiko:</span>
              <span style={{ color: riskColor, fontWeight: 700, fontSize: 14 }}>{riskLevel}</span>
            </div>
            <div className="h-5 w-px" style={{ background: 'var(--border)' }} />
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--advise-steel)' }}>
              <span>📅 {new Date(scan.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              <span>⏱ Durasi {scan.duration}</span>
              <span>🔗 <a href={scan.targetUrl} className="font-mono hover:underline" style={{ color: 'var(--advise-indigo)' }}>{scan.targetUrl}</a></span>
            </div>
            <a href={scan.targetUrl} target="_blank" rel="noopener noreferrer" className="ml-auto">
              <ExternalLink size={14} style={{ color: 'var(--advise-steel)' }} />
            </a>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Left: Donut Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="px-5 pt-5 pb-2">
                <h2 style={{ color: 'var(--advise-navy)', fontSize: 15, fontWeight: 700 }}>Risk Distribution</h2>
              </div>
              <div className="flex items-center justify-center py-2">
                <div className="relative" style={{ width: 200, height: 200 }}>
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%" cy="50%"
                        innerRadius={68} outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        onClick={(d) => setSelectedSeverity(prev => prev === d.name ? null : d.name as Severity)}
                        style={{ cursor: 'pointer' }}
                      >
                        {donutData.map(entry => (
                          <Cell
                            key={entry.name}
                            fill={SEV_CONFIG[entry.name as Severity].border}
                            opacity={selectedSeverity && selectedSeverity !== entry.name ? 0.3 : 1}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number, n: string) => [v, n]}
                        contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--advise-navy)' }}>{scan.summary.total}</span>
                    <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>Findings</span>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5 space-y-2">
                {(['Critical', 'High', 'Medium', 'Low'] as Severity[]).map(sev => {
                  const count = scan.summary[sev.toLowerCase() as keyof typeof scan.summary] as number;
                  const pct = scan.summary.total > 0 ? (count / scan.summary.total) * 100 : 0;
                  return (
                    <button
                      key={sev}
                      onClick={() => setSelectedSeverity(prev => prev === sev ? null : sev)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: SEV_CONFIG[sev].border }} />
                      <span className="text-sm flex-1 text-left" style={{ color: 'var(--advise-navy)', fontWeight: 500 }}>{sev}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: SEV_CONFIG[sev].border }} />
                      </div>
                      <span className="text-sm w-8 text-right" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Vulnerability Log */}
            <div className="lg:col-span-3 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 style={{ color: 'var(--advise-navy)', fontSize: 15, fontWeight: 700 }}>Vulnerability Log</h2>
                <Link href={`/dashboard/results/${scan.id}/vulnerabilities`}
                  className="flex items-center gap-1 text-sm" style={{ color: 'var(--advise-indigo)', fontWeight: 600 }}>
                  View All <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Search */}
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--advise-steel)' }} />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search vulnerabilities, IPs, or scan IDs..."
                    className="w-full pl-8 pr-4 py-2 text-sm outline-none rounded-xl"
                    style={{ background: 'var(--muted)', color: 'var(--advise-navy)', border: 'none' }}
                  />
                </div>
              </div>

              {/* Table Header */}
              <div className="grid px-4 py-2" style={{ gridTemplateColumns: '80px 1fr 140px 60px', borderBottom: '1px solid var(--border)' }}>
                {['RISK', 'VULNERABILITY', 'TARGET', 'STATUS'].map(h => (
                  <span key={h} className="text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 700, letterSpacing: '0.06em' }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
                {filteredVulns.length === 0 ? (
                  <div className="py-8 text-center text-sm" style={{ color: 'var(--advise-steel)' }}>Tidak ada temuan</div>
                ) : (
                  filteredVulns.map(vuln => {
                    const s = SEV_CONFIG[vuln.severity];
                    return (
                      <div
                        key={vuln.id}
                        onClick={() => setSelectedVuln(vuln)}
                        className="grid px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors border-b"
                        style={{ gridTemplateColumns: '80px 1fr 140px 60px', borderColor: 'var(--border)' }}
                      >
                        <div>
                          <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: s.bg, color: s.color }}>
                            {vuln.severity.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{vuln.name}</p>
                          {vuln.cve && <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--advise-steel)' }}>{vuln.cve}</p>}
                        </div>
                        <div>
                          <p className="text-xs font-mono truncate" style={{ color: 'var(--advise-steel)' }}>{vuln.path}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--advise-steel)', opacity: 0.7 }}>{scan.targetUrl.replace('https://', '')}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          {vuln.status === 'Resolved' ? (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#F0FDF4' }}>
                              <span style={{ fontSize: 14 }}>✓</span>
                            </div>
                          ) : vuln.status === 'In Progress' ? (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                              <span style={{ fontSize: 12 }}>⋯</span>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: s.bg }}>
                              <AlertTriangle size={12} style={{ color: s.color }} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Advanced Analysis Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Throughput — LIVE */}
            <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Throughput</p>
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: '#F0FDF4', color: '#16A34A', fontWeight: 600 }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#16A34A' }} />
                  Live Scanning Engine
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--advise-navy)', fontVariantNumeric: 'tabular-nums', minWidth: 72 }}>
                  {throughput.toLocaleString()}
                </p>
                <span className="text-sm" style={{ color: 'var(--advise-steel)' }}>req/sec</span>
                {/* live pulse dot */}
                <span className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: '#16A34A', flexShrink: 0 }} />
              </div>
              <div className="mt-3 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={8}>
                    <Bar dataKey="v" radius={[3, 3, 0, 0]}
                      fill="url(#barGrad)"
                    />
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4B5694" />
                        <stop offset="100%" stopColor="#7288AE" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>Peak: 890 req/sec</p>
                <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>Avg: 712 req/sec</p>
              </div>
            </div>

            {/* Code Coverage — LIVE */}
            <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Code Coverage</p>
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: '#EEF2FF', color: 'var(--advise-indigo)', fontWeight: 600 }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--advise-indigo)' }} />
                  Analyzing
                </div>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--advise-navy)', fontVariantNumeric: 'tabular-nums' }}>
                  {coverage.toFixed(1)}
                </p>
                <span className="text-lg" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>%</span>
              </div>
              <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${coverage}%`, background: 'linear-gradient(90deg, #4B5694, #7288AE)' }} />
              </div>
              <div className="mt-4 flex justify-center">
                <div className="relative">
                  <GaugeChart value={coverage} max={100} color="#4B5694" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center" style={{ marginBottom: 2 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--advise-navy)' }}>{coverage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              <p className="text-xs mt-1 text-center" style={{ color: 'var(--advise-steel)' }}>
                {endpointsMapped.toLocaleString()} endpoints mapped · 12 microservices
              </p>
            </div>

            {/* Scan Details */}
            <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs mb-3" style={{ color: 'var(--advise-steel)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Advanced Analysis</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Endpoint Dipindai', val: '47 endpoints' },
                  { label: 'Test Cases Dijalankan', val: '312 tests' },
                  { label: 'False Positive Rate', val: '3% (1 temuan)' },
                  { label: 'CVSS Score Tertinggi', val: '9.8 (Critical)' },
                  { label: 'OWASP Coverage', val: '9 / 10 categories' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>{item.label}</span>
                    <span className="text-xs" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Export Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowExporter(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white shadow-lg hover:opacity-90 transition-all hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg, #111844 0%, #4B5694 100%)', fontWeight: 700, boxShadow: '0 8px 32px rgba(17,24,68,0.4)' }}
        >
          <FileText size={16} />
          Export PDF Report
        </button>
      </div>

      {selectedVuln && <ActionableInsightsPanel vuln={selectedVuln} onClose={() => setSelectedVuln(null)} />}
      {showExporter && <ComplianceExporter scanId={scan.id} onClose={() => setShowExporter(false)} />}
    </div>
  );
}
