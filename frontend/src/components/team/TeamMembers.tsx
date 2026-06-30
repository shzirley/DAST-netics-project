"use client";

import { useState } from 'react';
import { Plus, X, Mail, Check } from 'lucide-react';
import { mockTeamMembers, type Role, type TeamMember } from '../../mockData';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';

function RoleBadge({ role }: { role: Role }) {
  const map: Record<Role, { bg: string; color: string }> = {
    Admin: { bg: '#EEF2FF', color: 'var(--advise-indigo)' },
    Member: { bg: '#F0FDF4', color: '#16A34A' },
    Viewer: { bg: 'var(--muted)', color: 'var(--advise-steel)' },
  };
  const s = map[role];
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs" style={{ fontWeight: 600, background: s.bg, color: s.color }}>{role}</span>;
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState<Role>('Member');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    toast.success(`Undangan dikirim ke ${emails.split(',').length} email`);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 style={{ color: 'var(--advise-navy)', fontSize: 16, fontWeight: 700 }}>Undang Anggota Tim</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
              <X size={16} style={{ color: 'var(--advise-steel)' }} />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Email (pisahkan dengan koma)</label>
              <textarea
                value={emails}
                onChange={e => setEmails(e.target.value)}
                placeholder="budi@company.com, siti@company.com"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', background: 'var(--input-background)' }}
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>Role Default</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as Role)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)' }}
              >
                <option>Admin</option>
                <option>Member</option>
                <option>Viewer</option>
              </select>
            </div>
            <div className="p-3 rounded-xl text-xs" style={{ background: 'var(--muted)' }}>
              <p className="mb-1" style={{ fontWeight: 600, color: 'var(--advise-navy)' }}>Perbedaan Role:</p>
              <p style={{ color: 'var(--advise-steel)' }}>• Admin: Akses penuh termasuk billing & settings</p>
              <p style={{ color: 'var(--advise-steel)' }}>• Member: Dapat scan, assign, dan resolve kerentanan</p>
              <p style={{ color: 'var(--advise-steel)' }}>• Viewer: Hanya bisa lihat hasil (cocok untuk klien)</p>
            </div>
          </div>
          <div className="flex gap-3 px-5 pb-5">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)', fontWeight: 600 }}>Batal</button>
            <button
              onClick={handleSend}
              disabled={!emails.trim() || sending}
              className="flex-1 py-2.5 rounded-xl text-white text-sm flex items-center justify-center gap-2"
              style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
            >
              {sending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Mail size={14} />}
              {sending ? 'Mengirim...' : 'Kirim Undangan'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showInvite, setShowInvite] = useState(false);

  const updateRole = (id: string, role: Role) => {
    setMembers(m => m.map(member => member.id === id ? { ...member, role } : member));
    toast.success('Role berhasil diperbarui');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ color: 'var(--advise-navy)', fontSize: 22, fontWeight: 700 }}>Tim & Kolaborasi</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--advise-steel)' }}>
            {members.filter(m => m.status === 'Active').length} anggota aktif
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90"
          style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}
        >
          <Plus size={16} />
          Undang Anggota
        </button>
      </div>

      {/* Role Guide */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { role: 'Admin', desc: 'Akses penuh', count: members.filter(m => m.role === 'Admin').length },
          { role: 'Member', desc: 'Dapat scan & assign', count: members.filter(m => m.role === 'Member').length },
          { role: 'Viewer', desc: 'Read only', count: members.filter(m => m.role === 'Viewer').length },
        ].map(r => (
          <div key={r.role} className="bg-white rounded-2xl p-4 border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-1">
              <RoleBadge role={r.role as Role} />
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--advise-navy)' }}>{r.count}</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 style={{ color: 'var(--advise-navy)', fontSize: 14, fontWeight: 700 }}>Anggota Tim</h2>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {members.map(member => (
            <div key={member.id} className="flex items-center gap-4 px-5 py-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback style={{ background: 'var(--advise-indigo)', color: 'white', fontSize: 13, fontWeight: 700 }}>
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>{member.name}</p>
                  {member.status === 'Invited' && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--advise-medium-bg)', color: 'var(--advise-medium)', fontWeight: 600 }}>
                      Diundang
                    </span>
                  )}
                  {member.id === 'm1' && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EEF2FF', color: 'var(--advise-indigo)', fontWeight: 600 }}>
                      Kamu
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>{member.email}</p>
              </div>
              <select
                value={member.role}
                onChange={e => updateRole(member.id, e.target.value as Role)}
                disabled={member.id === 'm1'}
                className="px-3 py-1.5 rounded-xl border text-sm outline-none"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--advise-navy)',
                  background: 'white',
                  opacity: member.id === 'm1' ? 0.6 : 1,
                }}
              >
                <option>Admin</option>
                <option>Member</option>
                <option>Viewer</option>
              </select>
              {member.id !== 'm1' && (
                <button
                  onClick={() => { setMembers(m => m.filter(x => x.id !== member.id)); toast.success('Anggota dihapus dari tim'); }}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  title="Hapus dari tim"
                >
                  <X size={14} style={{ color: 'var(--advise-critical)' }} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}
