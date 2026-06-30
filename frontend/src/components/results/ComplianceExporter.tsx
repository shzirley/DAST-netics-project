"use client";

import { useState } from 'react';
import { X, Download, FileText, Loader } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  scanId: string;
  onClose: () => void;
}

export function ComplianceExporter({ scanId, onClose }: Props) {
  const [clientName, setClientName] = useState('');
  const [options, setOptions] = useState({
    executive: true,
    technical: true,
    recommendations: true,
  });
  const [template, setTemplate] = useState('Professional');
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2500));
    setGenerating(false);
    setDone(true);
    toast.success('Laporan PDF berhasil digenerate!');
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <FileText size={18} style={{ color: 'var(--advise-indigo)' }} />
              <h2 style={{ color: 'var(--advise-navy)', fontSize: 16, fontWeight: 700 }}>Export PDF Report</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={16} style={{ color: 'var(--advise-steel)' }} />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Cover Preview */}
            <div className="rounded-xl p-5 text-center" style={{ background: 'var(--advise-navy)', minHeight: 120 }}>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded" style={{ background: 'var(--advise-indigo)' }} />
                <span className="text-white text-sm" style={{ fontWeight: 700 }}>ADVISE</span>
              </div>
              <h3 className="text-white mb-1" style={{ fontSize: 16, fontWeight: 700 }}>
                {clientName ? `Laporan Keamanan — ${clientName}` : 'Laporan Keamanan Aplikasi'}
              </h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} · DAST Security Report
              </p>
            </div>

            {/* Client Name */}
            <div>
              <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Nama Klien</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="PT Maju Sejahtera"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
              />
            </div>

            {/* Template */}
            <div>
              <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Template</label>
              <div className="flex gap-2">
                {['Professional', 'Executive', 'Technical'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className="flex-1 py-2 rounded-xl border text-xs transition-colors"
                    style={{
                      borderColor: template === t ? 'var(--advise-indigo)' : 'var(--border)',
                      background: template === t ? '#EEF2FF' : 'white',
                      color: template === t ? 'var(--advise-indigo)' : 'var(--advise-steel)',
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <p className="text-sm mb-2" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Konten Laporan</p>
              <div className="space-y-2">
                {[
                  { key: 'executive', label: 'Executive Summary', desc: 'Ringkasan non-teknis untuk manajemen' },
                  { key: 'technical', label: 'Bukti Teknis', desc: 'Payload, screenshot, request/response' },
                  { key: 'recommendations', label: 'Rekomendasi Perbaikan', desc: 'Panduan remediasi dengan code snippet' },
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <input
                      type="checkbox"
                      checked={options[opt.key as keyof typeof options]}
                      onChange={e => setOptions(o => ({ ...o, [opt.key]: e.target.checked }))}
                      className="rounded"
                    />
                    <div>
                      <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{opt.label}</p>
                      <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5">
            {!done ? (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 rounded-xl text-white flex items-center justify-center gap-2 text-sm"
                style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
              >
                {generating ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Menyusun laporan...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Generate PDF
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-xl text-center" style={{ background: '#F0FDF4' }}>
                  <p className="text-sm" style={{ color: '#16A34A', fontWeight: 600 }}>✓ PDF berhasil digenerate</p>
                </div>
                <button
                  onClick={() => toast.info('Download dimulai...')}
                  className="w-full py-2.5 rounded-xl text-white flex items-center justify-center gap-2 text-sm"
                  style={{ background: '#16A34A', fontWeight: 600 }}
                >
                  <Download size={16} />
                  Unduh PDF
                </button>
                <button
                  onClick={() => setDone(false)}
                  className="w-full py-2 text-sm text-center"
                  style={{ color: 'var(--advise-steel)' }}
                >
                  Generate ulang dengan opsi lain
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
