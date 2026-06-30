"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Target, Users, Settings,
  Bell, LogOut, ChevronDown, Shield, Menu, X, Zap
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Toaster } from 'sonner';
import { cn } from '../ui/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Targets', icon: Target, path: '/dashboard/targets' },
  { label: 'Scans', icon: Zap, path: '/dashboard/scans' },
  { label: 'Team', icon: Users, path: '/dashboard/team' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('advise_auth');
    router.push('/');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--advise-beige)' }}>
      <Toaster position="top-right" richColors />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-60 flex-col transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ background: 'var(--advise-navy)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: 'var(--advise-indigo)' }}>
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white tracking-wide" style={{ fontWeight: 800, fontSize: 16 }}>ADVISE</span>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: '0.15em' }}>DAST PLATFORM</p>
          </div>
          <button className="ml-auto text-white/60 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link key={item.path}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
                isActive(item.path)
                  ? 'text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
              style={isActive(item.path) ? { background: 'var(--advise-indigo)' } : {}}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ background: 'var(--advise-indigo)', color: 'white', fontWeight: 700 }}>
              AP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate" style={{ fontWeight: 600 }}>Admin User</p>
              <p className="text-white/40 truncate" style={{ fontSize: 11 }}>security-admin@advise.io</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-2.5 border-b bg-white" style={{ borderColor: 'var(--border)', minHeight: 48 }}>
          <button className="text-gray-500 lg:hidden p-1" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-xl hover:bg-black/5 transition-colors">
                  <Bell size={17} style={{ color: 'var(--advise-steel)' }} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white" style={{ background: 'var(--advise-critical)' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-sm" style={{ fontWeight: 700, color: 'var(--advise-navy)' }}>Notifikasi</p>
                </div>
                {[
                  { icon: '🔴', title: 'Scan selesai — Client Web App', desc: 'Ditemukan 1 kerentanan Critical', time: '5 menit lalu' },
                  { icon: '🎟️', title: 'Ticket di-assign ke kamu', desc: 'SQL Injection pada /api/users', time: '1 jam lalu' },
                  { icon: '✅', title: 'Scan mingguan selesai', desc: 'E-Commerce API — 4 temuan', time: '1 hari lalu' },
                ].map((n, i) => (
                  <DropdownMenuItem key={i} className="px-3 py-2.5 cursor-pointer">
                    <div className="flex gap-3">
                      <span style={{ fontSize: 16 }}>{n.icon}</span>
                      <div>
                        <p className="text-sm" style={{ fontWeight: 600 }}>{n.title}</p>
                        <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>{n.desc}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--advise-steel)' }}>{n.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl hover:bg-black/5 px-2 py-1.5 transition-colors">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ background: 'var(--advise-indigo)', color: 'white', fontWeight: 700 }}>
                    AP
                  </div>
                  <ChevronDown size={12} style={{ color: 'var(--advise-steel)' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>Pengaturan Akun</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings?tab=billing')}>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut size={14} className="mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
