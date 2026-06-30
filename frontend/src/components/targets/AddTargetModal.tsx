"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Target } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onClose: () => void;
  prefillUrl?: string;
}

export function AddTargetModal({ onClose, prefillUrl = '' }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    url: prefillUrl,
    environment: 'Staging',
    description: '',
    scanNow: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.url) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success(`Target "${form.name}" berhasil ditambahkan`);
    onClose();
    if (form.scanNow) router.push('/dashboard/scan');
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <Target size={18} style={{ color: 'var(--advise-indigo)' }} />
              <h2 style={{ color: 'var(--advise-navy)', fontSize: 16, fontWeight: 700 }}>Tambah Target Baru</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
              <X size={16} style={{ color: 'var(--advise-steel)' }} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Nama Target *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Client Web App - Staging"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>URL Target *</label>
              <input
                type="url"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="https://staging.app.com"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none font-mono"
                style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Environment</label>
              <select
                value={form.environment}
                onChange={e => setForm(f => ({ ...f, environment: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
              >
                <option>Production</option>
                <option>Staging</option>
                <option>Development</option>
                <option>QA</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Deskripsi (opsional)</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Deskripsi singkat tentang target ini..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
              <input
                type="checkbox"
                checked={form.scanNow}
                onChange={e => setForm(f => ({ ...f, scanNow: e.target.checked }))}
              />
              <div>
                <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Scan sekarang setelah disimpan</p>
                <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>Mulai scan DAST segera</p>
              </div>
            </label>
          </div>

          <div className="flex gap-3 px-5 pb-5">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', fontWeight: 600 }}>
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!form.name || !form.url || loading}
              className="flex-1 py-2.5 rounded-xl text-white text-sm"
              style={{ background: 'var(--advise-indigo)', fontWeight: 600, opacity: (!form.name || !form.url) ? 0.6 : 1 }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Target'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
