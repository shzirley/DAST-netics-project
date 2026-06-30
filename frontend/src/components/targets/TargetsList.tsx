"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Target, ArrowRight, CheckCircle, XCircle, Play } from 'lucide-react';
import { mockTargets, type Severity, type Environment } from '../../mockData';
import { AddTargetModal } from './AddTargetModal';

function SeverityBadge({ severity }: { severity: Severity | null }) {
  if (!severity) return <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>—</span>;
  const map: Record<Severity, { bg: string; color: string }> = {
    Critical: { bg: 'var(--advise-critical-bg)', color: 'var(--advise-critical)' },
    High: { bg: 'var(--advise-high-bg)', color: 'var(--advise-high)' },
    Medium: { bg: 'var(--advise-medium-bg)', color: 'var(--advise-medium)' },
    Low: { bg: 'var(--advise-low-bg)', color: 'var(--advise-low)' },
  };
  const style = map[severity];
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs" style={{ fontWeight: 600, background: style.bg, color: style.color }}>{severity}</span>;
}

function EnvBadge({ env }: { env: Environment }) {
  const map: Record<Environment, { bg: string; color: string }> = {
    Production: { bg: '#FEF2F2', color: '#DC2626' },
    Staging: { bg: '#FFFBEB', color: '#D97706' },
    Development: { bg: '#F0FDF4', color: '#16A34A' },
    QA: { bg: '#EFF6FF', color: '#2563EB' },
  };
  const s = map[env];
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs" style={{ fontWeight: 600, background: s.bg, color: s.color }}>{env}</span>;
}

export function TargetsList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [envFilter, setEnvFilter] = useState<Environment | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = mockTargets.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.url.toLowerCase().includes(search.toLowerCase());
    const matchEnv = envFilter === 'All' || t.environment === envFilter;
    return matchSearch && matchEnv;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 style={{ color: 'var(--advise-navy)', fontSize: 22, fontWeight: 700 }}>Targets</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--advise-steel)' }}>
            {mockTargets.length} target tersimpan
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90"
          style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
        >
          <Plus size={16} />
          Tambah Target
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--advise-steel)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari target..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'white' }}
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'Production', 'Staging', 'Development', 'QA'] as const).map(env => (
            <button
              key={env}
              onClick={() => setEnvFilter(env)}
              className="px-3 py-2 rounded-xl border text-xs transition-colors"
              style={{
                borderColor: envFilter === env ? 'var(--advise-indigo)' : 'var(--border)',
                background: envFilter === env ? '#EEF2FF' : 'white',
                color: envFilter === env ? 'var(--advise-indigo)' : 'var(--advise-steel)',
                fontWeight: 600,
              }}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: 'var(--border)' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--muted)' }}>
            <Target size={28} style={{ color: 'var(--advise-steel)' }} />
          </div>
          <h3 className="mb-2" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>Belum Ada Target</h3>
          <p className="text-sm mb-5" style={{ color: 'var(--advise-steel)' }}>Tambahkan target pertama untuk mulai scan berkala</p>
          <button onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl text-white text-sm" style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}>
            + Tambah Target
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Target', 'URL', 'Environment', 'Scan Terakhir', 'Tertinggi', 'Jadwal', ''].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {filtered.map(target => (
                  <tr
                    key={target.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/targets/${target.id}`)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--muted)' }}>
                          <Target size={16} style={{ color: 'var(--advise-indigo)' }} />
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{target.name}</p>
                          <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>{target.scansCount} scan</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-mono" style={{ color: 'var(--advise-steel)' }}>{target.url}</p>
                    </td>
                    <td className="px-5 py-4">
                      <EnvBadge env={target.environment} />
                    </td>
                    <td className="px-5 py-4">
                      {target.lastScanDate ? (
                        <div className="flex items-center gap-1.5">
                          {target.lastScanStatus === 'Completed' ? <CheckCircle size={13} style={{ color: '#16A34A' }} /> : <XCircle size={13} style={{ color: 'var(--advise-critical)' }} />}
                          <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>
                            {new Date(target.lastScanDate).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>Belum pernah</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <SeverityBadge severity={target.highestSeverity} />
                    </td>
                    <td className="px-5 py-4">
                      {target.scheduleEnabled ? (
                        <span className="text-xs px-2 py-1 rounded-lg" style={{ background: '#F0FDF4', color: '#16A34A', fontWeight: 600 }}>
                          {target.scheduleFrequency}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>Manual</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => { e.stopPropagation(); router.push('/dashboard/scan'); }}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="Scan sekarang"
                        >
                          <Play size={13} style={{ color: 'var(--advise-indigo)' }} />
                        </button>
                        <ArrowRight size={14} style={{ color: 'var(--advise-steel)' }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && <AddTargetModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
