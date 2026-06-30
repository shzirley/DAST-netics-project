"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Terminal, ChevronDown, CheckCircle, XCircle, AlertTriangle, ArrowRight, Pause } from 'lucide-react';

const SCAN_PHASES = [
  { id: 'discovery', label: 'Discovery', icon: '🔍', desc: 'Mapping endpoints & surface' },
  { id: 'fingerprint', label: 'Fingerprint', icon: '🧬', desc: 'Tech stack detection' },
  { id: 'testing', label: 'Vulnerability Testing', icon: '⚔️', desc: 'Active attack simulation' },
  { id: 'analysis', label: 'Analysis', icon: '📊', desc: 'Risk scoring & aggregation' },
];

const LOG_LINES = [
  { time: '14:30:01', type: 'info', msg: 'Scanner v2.4.1 initialized' },
  { time: '14:30:01', type: 'info', msg: 'Resolving DNS for target...' },
  { time: '14:30:02', type: 'success', msg: 'Connection established (200ms RTT)' },
  { time: '14:30:02', type: 'info', msg: 'Detecting tech stack...' },
  { time: '14:30:03', type: 'info', msg: 'Detected: Node.js 18, Express 4.x, PostgreSQL' },
  { time: '14:30:04', type: 'info', msg: 'Crawling application routes...' },
  { time: '14:30:05', type: 'info', msg: 'Found 47 endpoints across 12 paths' },
  { time: '14:30:06', type: 'warn', msg: 'Testing SQL Injection on /api/users?id=' },
  { time: '14:30:07', type: 'critical', msg: '[CRITICAL] SQL Injection confirmed on /api/users' },
  { time: '14:30:08', type: 'info', msg: 'Testing XSS on /search?q= ...' },
  { time: '14:30:09', type: 'warn', msg: '[HIGH] Reflected XSS found on /search endpoint' },
  { time: '14:30:10', type: 'info', msg: 'Checking authentication endpoints...' },
  { time: '14:30:11', type: 'warn', msg: '[HIGH] Session token has no expiry (JWT)' },
  { time: '14:30:12', type: 'info', msg: 'Scanning /api/documents for IDOR...' },
  { time: '14:30:13', type: 'info', msg: 'Checking CORS configuration...' },
  { time: '14:30:14', type: 'warn', msg: '[MEDIUM] Missing security headers on / route' },
  { time: '14:30:15', type: 'info', msg: 'Testing rate limiting on /api/login...' },
  { time: '14:30:16', type: 'info', msg: 'Checking for sensitive data in JS bundles...' },
  { time: '14:30:17', type: 'warn', msg: '[HIGH] API key exposed in /js/app.bundle.js' },
  { time: '14:30:18', type: 'info', msg: 'Validating TLS/SSL configuration...' },
  { time: '14:30:19', type: 'info', msg: 'Running business logic tests...' },
  { time: '14:30:20', type: 'success', msg: 'All phases complete. Aggregating results...' },
];

function RadarRing({ progress, size = 180 }: { progress: number; size?: number }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ position: 'absolute' }}>
        {/* Background ring */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        {/* Progress ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="#4B5694"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
        {/* Glow ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="#7288AE"
          strokeWidth="2"
          strokeOpacity="0.3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.3s ease', filter: 'blur(2px)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1 }}>{Math.round(progress)}%</span>
        <span className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>complete</span>
      </div>
    </div>
  );
}

export function LiveScanMonitor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || 'https://staging.client-web.com';
  const scanDepth = searchParams.get('scanDepth') || 'standard';

  const [progress, setProgress] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [status, setStatus] = useState<'running' | 'completed' | 'failed'>('running');
  const [found, setFound] = useState({ critical: 0, high: 0, medium: 0, low: 0 });
  const [endpointsScanned, setEndpointsScanned] = useState(0);
  const [reqPerSec, setReqPerSec] = useState(0);
  const [logs, setLogs] = useState<typeof LOG_LINES>([]);
  const [showLogs, setShowLogs] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);
  const logIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== 'running') return;

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + Math.random() * 5 + 2, 100);

        // Update phase
        const phaseIndex = Math.floor((next / 100) * SCAN_PHASES.length);
        setActivePhase(Math.min(phaseIndex, SCAN_PHASES.length - 1));

        // Update endpoints
        setEndpointsScanned(Math.round((next / 100) * 47));
        setReqPerSec(Math.round(400 + Math.random() * 400));

        // Add log line
        if (logIndexRef.current < LOG_LINES.length) {
          const lineIdx = Math.floor((next / 100) * LOG_LINES.length);
          if (lineIdx > logIndexRef.current) {
            const newLines = LOG_LINES.slice(logIndexRef.current, lineIdx);
            logIndexRef.current = lineIdx;
            setLogs(l => [...l, ...newLines]);
          }
        }

        // Update found vulns
        if (next > 28) setFound(f => ({ ...f, critical: 1 }));
        if (next > 40) setFound(f => ({ ...f, high: Math.max(f.high, 1) }));
        if (next > 52) setFound(f => ({ ...f, high: Math.max(f.high, 2) }));
        if (next > 65) setFound(f => ({ ...f, medium: Math.max(f.medium, 1) }));
        if (next > 75) setFound(f => ({ ...f, high: Math.max(f.high, 3) }));
        if (next > 85) setFound(f => ({ ...f, low: 1 }));

        if (next >= 100) {
          setStatus('completed');
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => router.push('/dashboard/results/s1'), 2500);
        }

        return next;
      });
    }, 250);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status, router]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const totalFound = found.critical + found.high + found.medium + found.low;
  const timeLeft = Math.max(0, Math.round((100 - progress) * 0.25));

  const logColor: Record<string, string> = {
    info: 'rgba(255,255,255,0.55)',
    success: '#86EFAC',
    warn: '#FCD34D',
    critical: '#FCA5A5',
  };

  return (
    <div className="min-h-full" style={{ background: '#F8F7F4' }}>
      {/* Top Bar */}
      <div className="px-6 py-3 border-b bg-white flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => router.push('/dashboard/scan')} className="flex items-center gap-1.5 text-sm hover:opacity-70" style={{ color: 'var(--advise-steel)' }}>
          <ArrowLeft size={14} /> Kembali
        </button>
        <div className="flex items-center gap-2 ml-3">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: status === 'running' ? '#16A34A' : status === 'completed' ? '#4B5694' : 'var(--advise-critical)' }} />
          <span className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>
            {status === 'running' ? 'Scan Berjalan' : status === 'completed' ? 'Scan Selesai' : 'Scan Gagal'}
          </span>
        </div>
        <code className="text-xs px-2 py-1 rounded-lg ml-2" style={{ background: 'var(--muted)', color: 'var(--advise-steel)' }}>{url}</code>
        {status === 'running' && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--advise-steel)' }}>Sisa ~{timeLeft}s</span>
            <button onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--advise-navy)' }}>
              <Pause size={11} /> Background
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: Dark Panel — Radar + Stats */}
          <div className="lg:col-span-1 space-y-4">
            {/* Radar Card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #111844 0%, #1a2255 50%, #0f1535 100%)' }}>
              <div className="p-5 flex flex-col items-center">
                <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {SCAN_PHASES[activePhase]?.label ?? 'Inisialisasi'}
                </p>
                <RadarRing progress={progress} size={168} />
                <p className="mt-4 text-xs text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {SCAN_PHASES[activePhase]?.desc}
                </p>
              </div>

              {/* Phase Steps */}
              <div className="px-4 pb-4 space-y-1">
                {SCAN_PHASES.map((phase, i) => {
                  const done = i < activePhase || status === 'completed';
                  const active = i === activePhase && status === 'running';
                  return (
                    <div key={phase.id} className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors"
                      style={{ background: active ? 'rgba(75,86,148,0.25)' : 'transparent' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: done ? '#4B5694' : active ? 'rgba(75,86,148,0.4)' : 'rgba(255,255,255,0.05)' }}>
                        {done ? <CheckCircle size={12} className="text-white" /> : <span className="text-xs">{phase.icon}</span>}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs" style={{ color: done || active ? 'white' : 'rgba(255,255,255,0.3)', fontWeight: active ? 700 : 500 }}>{phase.label}</p>
                      </div>
                      {active && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4B5694' }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Endpoints', val: endpointsScanned, suffix: '/ 47', color: 'var(--advise-indigo)' },
                { label: 'Req/sec', val: reqPerSec, suffix: '', color: '#16A34A' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 border" style={{ borderColor: 'var(--border)' }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}<span className="text-xs ml-1" style={{ color: 'var(--advise-steel)', fontWeight: 400 }}>{s.suffix}</span></p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--advise-steel)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Findings + Log */}
          <div className="lg:col-span-2 space-y-4">
            {/* Found So Far */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>
                  Ditemukan Sejauh Ini
                  {totalFound > 0 && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--advise-critical-bg)', color: 'var(--advise-critical)', fontWeight: 700 }}>{totalFound} temuan</span>}
                </p>
                {status === 'completed' && (
                  <button onClick={() => router.push('/dashboard/results/s1')}
                    className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl text-white"
                    style={{ background: 'var(--advise-indigo)', fontWeight: 600 }}>
                    Lihat Hasil <ArrowRight size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Critical', count: found.critical, color: 'var(--advise-critical)', bg: 'var(--advise-critical-bg)', border: '#C0392B' },
                  { label: 'High', count: found.high, color: 'var(--advise-high)', bg: 'var(--advise-high-bg)', border: '#D97706' },
                  { label: 'Medium', count: found.medium, color: 'var(--advise-medium)', bg: 'var(--advise-medium-bg)', border: '#B7891A' },
                  { label: 'Low', count: found.low, color: 'var(--advise-low)', bg: 'var(--advise-low-bg)', border: '#2563EB' },
                ].map(item => (
                  <div key={item.label} className="rounded-2xl p-4 border-2 transition-all"
                    style={{
                      background: item.count > 0 ? item.bg : 'white',
                      borderColor: item.count > 0 ? `${item.border}40` : 'var(--border)',
                      transform: item.count > 0 ? 'scale(1.02)' : 'scale(1)',
                    }}>
                    <p style={{ fontSize: 32, fontWeight: 800, color: item.count > 0 ? item.color : 'var(--advise-steel)', lineHeight: 1 }}>{item.count}</p>
                    <p className="text-xs mt-1" style={{ color: item.count > 0 ? item.color : 'var(--advise-steel)', fontWeight: 600 }}>{item.label}</p>
                    {item.count > 0 && (
                      <div className="mt-2 h-1 rounded-full" style={{ background: `${item.border}30` }}>
                        <div className="h-full rounded-full" style={{ background: item.color, width: `${Math.min(100, item.count * 25)}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Vulnerabilities Feed */}
            {logs.some(l => l.type === 'critical' || l.type === 'warn') && (
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--advise-navy)', fontWeight: 700 }}>Live Findings</p>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {logs.filter(l => l.type === 'critical' || l.type === 'warn').map((l, i) => {
                    const isCritical = l.type === 'critical';
                    return (
                      <div key={i} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: isCritical ? 'var(--advise-critical-bg)' : 'var(--advise-high-bg)' }}>
                          <AlertTriangle size={13} style={{ color: isCritical ? 'var(--advise-critical)' : 'var(--advise-high)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs" style={{ color: 'var(--advise-navy)', fontWeight: 600 }}>
                            {l.msg.replace('[CRITICAL] ', '').replace('[HIGH] ', '')}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--advise-steel)' }}>{l.time}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: isCritical ? 'var(--advise-critical-bg)' : 'var(--advise-high-bg)',
                            color: isCritical ? 'var(--advise-critical)' : 'var(--advise-high)',
                            fontWeight: 700,
                          }}>
                          {isCritical ? 'Critical' : 'High'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Terminal Log */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0D1117' }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: '#161B22' }}>
                <div className="flex items-center gap-2">
                  <Terminal size={13} style={{ color: '#58A6FF' }} />
                  <span className="text-xs" style={{ color: '#58A6FF', fontWeight: 600 }}>Scanner Output</span>
                  {status === 'running' && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#3FB950' }} />}
                </div>
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="text-xs flex items-center gap-1"
                  style={{ color: '#8B949E' }}
                >
                  {showLogs ? 'Collapse' : 'Expand'}
                  <ChevronDown size={12} style={{ transform: showLogs ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
              </div>
              {showLogs && (
                <div ref={logRef} className="p-4 h-52 overflow-y-auto font-mono text-xs" style={{ lineHeight: 1.7 }}>
                  {logs.map((line, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span style={{ color: '#484F58', flexShrink: 0 }}>{line.time}</span>
                      <span style={{ color: logColor[line.type] ?? 'rgba(255,255,255,0.55)' }}>
                        {line.msg}
                      </span>
                    </div>
                  ))}
                  {status === 'running' && (
                    <div className="flex items-center gap-1" style={{ color: '#3FB950' }}>
                      <span className="animate-pulse">▊</span>
                    </div>
                  )}
                  {status === 'completed' && (
                    <div style={{ color: '#3FB950', marginTop: 4 }}>
                      ✓ Scan completed. Redirecting to results...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
