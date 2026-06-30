"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Play, GitCompare, Calendar, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { mockTargets, mockScans, type Severity, type ScanStatus } from '../../mockData';
import { toast } from 'sonner';

function SeverityBadge({ severity }: { severity: Severity | null }) {
  if (!severity) return <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>—</span>;
  const map: Record<Severity, { bg: string; color: string }> = {
    Critical: { bg: 'var(--advise-critical-bg)', color: 'var(--advise-critical)' },
    High: { bg: 'var(--advise-high-bg)', color: 'var(--advise-high)' },
    Medium: { bg: 'var(--advise-medium-bg)', color: 'var(--advise-medium)' },
    Low: { bg: 'var(--advise-low-bg)', color: 'var(--advise-low)' },
  };
  const s = map[severity];
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs" style={{ fontWeight: 600, background: s.bg, color: s.color }}>{severity}</span>;
}

export function TargetDetail() {
  const { targetId } = useParams<{ targetId: string }>();
  const router = useRouter();
  const target = mockTargets.find(t => t.id === targetId) ?? mockTargets[0];
  const scans = mockScans.filter(s => s.targetId === target.id);

  const [scheduleEnabled, setScheduleEnabled] = useState(target.scheduleEnabled);
  const [frequency, setFrequency] = useState(target.scheduleFrequency);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <button onClick={() => router.push('/dashboard/targets')} className="flex items-center gap-1.5 text-sm mb-4 hover:opacity-70" style={{ color: 'var(--advise-steel)' }}>
        <ArrowLeft size={14} /> Targets
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ color: 'var(--advise-navy)', fontSize: 22, fontWeight: 700 }}>{target.name}</h1>
          <p className="text-sm font-mono mt-0.5" style={{ color: 'var(--advise-steel)' }}>{target.url}</p>
          {target.description && (
            <p className="text-sm mt-1" style={{ color: 'var(--advise-steel)' }}>{target.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {scans.length >= 2 && (
            <Link href={`/dashboard/results/${scans[0].id}/compare`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm hover:bg-gray-50"
              style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', fontWeight: 600 }}
            >
              <GitCompare size={14} />
              Bandingkan Scan
            </Link>
          )}
          <button
            onClick={() => router.push('/dashboard/scan')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90"
            style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
          >
            <Play size={14} />
            Scan Sekarang
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info & Schedule */}
        <div className="space-y-4">
          {/* Info Card */}
          <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)' }}>
            <h2 className="mb-4" style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>Informasi Target</h2>
            <div className="space-y-3">
              {[
                { label: 'Environment', value: target.environment },
                { label: 'Jumlah Scan', value: `${target.scansCount} scan` },
                { label: 'Scan Terakhir', value: target.lastScanDate ? new Date(target.lastScanDate).toLocaleDateString('id-ID') : 'Belum pernah' },
                { label: 'Severity Tertinggi', value: <SeverityBadge severity={target.highestSeverity} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>{item.label}</span>
                  <span className="text-sm" style={{ color: 'var(--advise-navy)' }}>
                    {typeof item.value === 'string' ? item.value : item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>Jadwal Scan Berkala</h2>
              <div
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className="relative w-10 h-5 rounded-full transition-colors cursor-pointer"
                style={{ background: scheduleEnabled ? 'var(--advise-indigo)' : 'var(--switch-background)' }}
              >
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  style={{ transform: scheduleEnabled ? 'translateX(20px)' : 'translateX(0)' }} />
              </div>
            </div>

            {scheduleEnabled && (
              <div className="space-y-3">
                <div>
                  <label className="block mb-1.5 text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>Frekuensi</label>
                  <select
                    value={frequency}
                    onChange={e => setFrequency(e.target.value as typeof frequency)}
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)' }}
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="p-3 rounded-xl" style={{ background: '#EEF2FF' }}>
                  <p className="text-xs" style={{ color: 'var(--advise-indigo)' }}>
                    <Calendar size={11} className="inline mr-1" />
                    Scan berikutnya: {frequency === 'Daily' ? 'Besok 09:00' : frequency === 'Weekly' ? 'Senin depan 09:00' : '1 Juli 2026'}
                  </p>
                </div>
                <button
                  onClick={() => toast.success('Jadwal disimpan')}
                  className="w-full py-2 rounded-xl text-white text-xs"
                  style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
                >
                  Simpan Jadwal
                </button>
              </div>
            )}
            {!scheduleEnabled && (
              <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>
                Aktifkan untuk scan otomatis berkala
              </p>
            )}
          </div>
        </div>

        {/* Right: Scan History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>Riwayat Scan</h2>
            </div>

            {scans.length === 0 ? (
              <div className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ background: 'var(--muted)' }}>
                  <Play size={22} style={{ color: 'var(--advise-steel)' }} />
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Belum ada scan untuk target ini</p>
                <button
                  onClick={() => router.push('/dashboard/scan')}
                  className="px-4 py-2 rounded-xl text-white text-sm"
                  style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
                >
                  Mulai Scan Pertama
                </button>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {scans.map(scan => (
                  <div
                    key={scan.id}
                    className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/results/${scan.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {scan.status === 'Completed' ? (
                          <CheckCircle size={16} style={{ color: '#16A34A' }} />
                        ) : (
                          <XCircle size={16} style={{ color: 'var(--advise-critical)' }} />
                        )}
                        <div>
                          <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>
                            Scan #{scan.id}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--advise-steel)' }}>
                              <Clock size={10} />
                              {new Date(scan.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>· {scan.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {scan.status === 'Completed' && (
                          <div className="flex gap-2">
                            {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
                              scan.summary[sev] > 0 ? (
                                <span key={sev} className="text-xs px-2 py-0.5 rounded-full" style={{
                                  background: `var(--advise-${sev}-bg)`,
                                  color: `var(--advise-${sev})`,
                                  fontWeight: 700,
                                }}>
                                  {scan.summary[sev]} {sev.charAt(0).toUpperCase()}
                                </span>
                              ) : null
                            ))}
                          </div>
                        )}
                        {scan.status === 'Failed' && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--advise-critical-bg)', color: 'var(--advise-critical)', fontWeight: 600 }}>
                            Gagal
                          </span>
                        )}
                        <ArrowRight size={14} style={{ color: 'var(--advise-steel)' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
