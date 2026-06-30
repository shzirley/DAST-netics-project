"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { mockScans } from '../../mockData';

export function ScansList() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 style={{ color: 'var(--advise-navy)', fontSize: 22, fontWeight: 700 }}>Semua Scan</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--advise-steel)' }}>{mockScans.length} scan total</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/scan')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90"
          style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
        >
          + Scan Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['Target', 'URL', 'Tanggal', 'Durasi', 'Status', 'Critical', 'High', 'Medium', 'Low', ''].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-left text-xs" style={{ color: 'var(--advise-steel)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {mockScans.map(scan => (
                <tr
                  key={scan.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => scan.status !== 'Failed' && router.push(`/dashboard/results/${scan.id}`)}
                >
                  <td className="px-5 py-4">
                    <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{scan.targetName}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-mono" style={{ color: 'var(--advise-steel)' }}>{scan.targetUrl}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>
                      {new Date(scan.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>{scan.duration}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {scan.status === 'Completed' ? <CheckCircle size={13} style={{ color: '#16A34A' }} /> : scan.status === 'Failed' ? <XCircle size={13} style={{ color: 'var(--advise-critical)' }} /> : null}
                      <span className="text-xs" style={{
                        color: scan.status === 'Completed' ? '#16A34A' : scan.status === 'Failed' ? 'var(--advise-critical)' : 'var(--advise-indigo)',
                        fontWeight: 600,
                      }}>
                        {scan.status}
                      </span>
                    </div>
                  </td>
                  {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
                    <td key={sev} className="px-5 py-4">
                      <span className="text-sm" style={{
                        fontWeight: 700,
                        color: scan.summary[sev] > 0 ? `var(--advise-${sev})` : 'var(--advise-steel)',
                      }}>
                        {scan.summary[sev] || '—'}
                      </span>
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    {scan.status !== 'Failed' && <ArrowRight size={14} style={{ color: 'var(--advise-steel)' }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
