"use client";

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { type Vulnerability, type Severity, type VulnStatus } from '../../mockData';

function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, { bg: string; color: string }> = {
    Critical: { bg: 'var(--advise-critical-bg)', color: 'var(--advise-critical)' },
    High: { bg: 'var(--advise-high-bg)', color: 'var(--advise-high)' },
    Medium: { bg: 'var(--advise-medium-bg)', color: 'var(--advise-medium)' },
    Low: { bg: 'var(--advise-low-bg)', color: 'var(--advise-low)' },
  };
  const style = map[severity];
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm" style={{ fontWeight: 700, background: style.bg, color: style.color }}>
      {severity}
    </span>
  );
}

function CodeBlock({ code, onCopy }: { code: string; onCopy?: () => void }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ background: 'var(--advise-navy)' }}>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
        style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
      >
        {copied ? <><Check size={11} /> Disalin!</> : <><Copy size={11} /> Copy</>}
      </button>
      <pre className="p-4 text-xs overflow-x-auto" style={{ color: '#A5F3FC', fontFamily: 'JetBrains Mono, Fira Code, monospace', lineHeight: 1.6 }}>
        {code}
      </pre>
    </div>
  );
}

interface Props {
  vuln: Vulnerability;
  onClose: () => void;
}

export function ActionableInsightsPanel({ vuln, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'desc' | 'evidence' | 'fix'>('desc');
  const [status, setStatus] = useState<VulnStatus>(vuln.status);
  const [assignee, setAssignee] = useState(vuln.assignee ?? '');

  const handleStatusChange = (newStatus: VulnStatus) => {
    setStatus(newStatus);
    toast.success(`Status diperbarui menjadi "${newStatus}"`);
  };

  const tabs = [
    { id: 'desc' as const, label: 'Deskripsi' },
    { id: 'evidence' as const, label: 'Bukti' },
    { id: 'fix' as const, label: 'Cara Memperbaiki' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-2 mb-2">
              <SeverityBadge severity={vuln.severity} />
              {vuln.cve && (
                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--advise-steel)' }}>
                  {vuln.cve}
                </span>
              )}
            </div>
            <h2 style={{ color: 'var(--advise-navy)', fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{vuln.name}</h2>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--advise-steel)' }}>{vuln.path}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X size={18} style={{ color: 'var(--advise-steel)' }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3 text-sm transition-colors"
              style={{
                color: activeTab === tab.id ? 'var(--advise-indigo)' : 'var(--advise-steel)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                borderBottom: activeTab === tab.id ? '2px solid var(--advise-indigo)' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs mb-2" style={{ color: 'var(--advise-steel)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deskripsi Teknis</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--advise-navy)', lineHeight: 1.7 }}>{vuln.description}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--advise-critical-bg)', border: '1px solid rgba(192,57,43,0.2)' }}>
                <p className="text-xs mb-1.5" style={{ color: 'var(--advise-critical)', fontWeight: 700 }}>⚠ Dampak Bisnis</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--advise-navy)', lineHeight: 1.6 }}>{vuln.impact}</p>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-3">
              <p className="text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payload & Bukti</p>
              <CodeBlock
                code={vuln.evidence}
                onCopy={() => toast.success('Bukti teknis disalin!')}
              />
              <div className="p-3 rounded-xl" style={{ background: 'var(--advise-medium-bg)' }}>
                <p className="text-xs" style={{ color: 'var(--advise-medium)', fontWeight: 600 }}>
                  ℹ Bukti di atas adalah hasil aktual dari scanner. Gunakan hanya untuk keperluan perbaikan di environment yang diotorisasi.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'fix' && (
            <div className="space-y-3">
              <p className="text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Langkah Perbaikan</p>
              <CodeBlock
                code={vuln.fix}
                onCopy={() => toast.success('Kode perbaikan disalin!')}
              />
              <div className="p-3 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.2)' }}>
                <p className="text-xs" style={{ color: '#16A34A', fontWeight: 600 }}>
                  ✓ Setelah menerapkan perbaikan, jalankan scan ulang untuk verifikasi
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>Status</label>
              <select
                value={status}
                onChange={e => handleStatusChange(e.target.value as VulnStatus)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'white' }}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>False Positive</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>Assignee</label>
              <input
                type="text"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                placeholder="Nama anggota tim"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'white' }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              toast.success('Perubahan disimpan');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl text-white text-sm"
            style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </>
  );
}
