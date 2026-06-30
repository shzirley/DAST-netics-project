"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockScans, type Severity } from '../../mockData';

const trendData = [
  { date: '7 Jun', critical: 2, high: 5, medium: 4, low: 3 },
  { date: '14 Jun', critical: 2, high: 4, medium: 4, low: 2 },
  { date: '21 Jun', critical: 1, high: 3, medium: 3, low: 1 },
  { date: '28 Jun', critical: 1, high: 3, medium: 2, low: 1 },
];

function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, { bg: string; color: string }> = {
    Critical: { bg: 'var(--advise-critical-bg)', color: 'var(--advise-critical)' },
    High: { bg: 'var(--advise-high-bg)', color: 'var(--advise-high)' },
    Medium: { bg: 'var(--advise-medium-bg)', color: 'var(--advise-medium)' },
    Low: { bg: 'var(--advise-low-bg)', color: 'var(--advise-low)' },
  };
  const s = map[severity];
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs" style={{ fontWeight: 600, background: s.bg, color: s.color }}>{severity}</span>;
}

export function ScanComparison() {
  const { scanId } = useParams<{ scanId: string }>();
  const router = useRouter();
  const [scanA, setScanA] = useState(scanId ?? 's2');
  const [scanB, setScanB] = useState('s1');

  const scanAData = mockScans.find(s => s.id === scanA) ?? mockScans[1];
  const scanBData = mockScans.find(s => s.id === scanB) ?? mockScans[0];

  const diffItems = [
    { name: 'SQL Injection pada /api/users', severity: 'Critical' as Severity, status: 'new' },
    { name: 'Missing Security Headers', severity: 'Medium' as Severity, status: 'fixed' },
    { name: 'Cross-Site Scripting (XSS)', severity: 'High' as Severity, status: 'existing' },
    { name: 'Broken Authentication', severity: 'High' as Severity, status: 'existing' },
    { name: 'IDOR pada /api/documents', severity: 'Medium' as Severity, status: 'fixed' },
    { name: 'Sensitive Data Exposure', severity: 'High' as Severity, status: 'existing' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button onClick={() => router.push(`/dashboard/results/${scanId}`)} className="flex items-center gap-1.5 text-sm mb-5 hover:opacity-70" style={{ color: 'var(--advise-steel)' }}>
        <ArrowLeft size={14} /> Risk Radar
      </button>

      <h1 className="mb-1" style={{ color: 'var(--advise-navy)', fontSize: 22, fontWeight: 700 }}>Perbandingan Scan</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--advise-steel)' }}>Lihat tren keamanan dari waktu ke waktu</p>

      {/* Scan Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[{ label: 'Scan A (Sebelumnya)', value: scanA, onChange: setScanA }, { label: 'Scan B (Terbaru)', value: scanB, onChange: setScanB }].map((sel, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border" style={{ borderColor: 'var(--border)' }}>
            <label className="block mb-2 text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 700 }}>{sel.label}</label>
            <select
              value={sel.value}
              onChange={e => sel.onChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none mb-3"
              style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)' }}
            >
              {mockScans.filter(s => s.status === 'Completed').map(s => (
                <option key={s.id} value={s.id}>
                  {s.targetName} — {new Date(s.date).toLocaleDateString('id-ID')}
                </option>
              ))}
            </select>
            {(() => {
              const s = i === 0 ? scanAData : scanBData;
              return (
                <div className="grid grid-cols-4 gap-2">
                  {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
                    <div key={sev} className="text-center">
                      <p className="text-sm" style={{ fontWeight: 700, color: `var(--advise-${sev})` }}>{s.summary[sev]}</p>
                      <p className="text-xs capitalize" style={{ color: 'var(--advise-steel)' }}>{sev}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        ))}
      </div>

      {/* Summary Delta */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(['critical', 'high', 'medium', 'low'] as const).map(sev => {
          const delta = scanBData.summary[sev] - scanAData.summary[sev];
          return (
            <div key={sev} className="bg-white rounded-2xl p-4 border" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs capitalize mb-1" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>{sev}</p>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 22, fontWeight: 700, color: `var(--advise-${sev})` }}>{scanBData.summary[sev]}</span>
                {delta !== 0 && (
                  <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-lg"
                    style={{
                      background: delta > 0 ? 'var(--advise-critical-bg)' : '#F0FDF4',
                      color: delta > 0 ? 'var(--advise-critical)' : '#16A34A',
                      fontWeight: 600,
                    }}>
                    {delta > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {Math.abs(delta)}
                  </span>
                )}
                {delta === 0 && <Minus size={14} style={{ color: 'var(--advise-steel)' }} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-2xl p-5 border mb-6" style={{ borderColor: 'var(--border)' }}>
        <h2 className="mb-4" style={{ color: 'var(--advise-navy)', fontSize: 15, fontWeight: 700 }}>Tren Kerentanan (4 Minggu Terakhir)</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--advise-steel)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--advise-steel)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="critical" stroke="var(--advise-critical)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="high" stroke="var(--advise-high)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="medium" stroke="var(--advise-medium)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="low" stroke="var(--advise-low)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Diff Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 style={{ color: 'var(--advise-navy)', fontSize: 15, fontWeight: 700 }}>Perubahan Kerentanan</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--muted)' }}>
              {['Nama', 'Severity', 'Perubahan'].map((h, i) => (
                <th key={i} className="px-5 py-3 text-left text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {diffItems.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 500 }}>{item.name}</td>
                <td className="px-5 py-3.5"><SeverityBadge severity={item.severity} /></td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                    style={{
                      background: item.status === 'new' ? 'var(--advise-critical-bg)' : item.status === 'fixed' ? '#F0FDF4' : 'var(--muted)',
                      color: item.status === 'new' ? 'var(--advise-critical)' : item.status === 'fixed' ? '#16A34A' : 'var(--advise-steel)',
                      fontWeight: 600,
                    }}>
                    {item.status === 'new' ? '↑ Baru Ditemukan' : item.status === 'fixed' ? '↓ Sudah Diperbaiki' : '→ Masih Ada'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
