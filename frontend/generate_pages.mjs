import fs from 'fs';
import path from 'path';

const pages = [
  { path: '', component: 'LoginScreen', file: 'auth/LoginScreen' },
  { path: 'register', component: 'RegisterScreen', file: 'auth/RegisterScreen' },
  { path: 'onboarding', component: 'OnboardingScreen', file: 'auth/OnboardingScreen' },
  { path: 'dashboard', component: 'DashboardHome', file: 'dashboard/DashboardHome', layout: 'layout/AppLayout' },
  { path: 'dashboard/scan', component: 'RapidScanGateway', file: 'scanning/RapidScanGateway' },
  { path: 'dashboard/scan/monitor', component: 'LiveScanMonitor', file: 'scanning/LiveScanMonitor' },
  { path: 'dashboard/scans', component: 'ScansList', file: 'dashboard/ScansList' },
  { path: 'dashboard/results/[scanId]', component: 'RiskRadarDashboard', file: 'results/RiskRadarDashboard' },
  { path: 'dashboard/results/[scanId]/vulnerabilities', component: 'VulnerabilityTable', file: 'results/VulnerabilityTable' },
  { path: 'dashboard/results/[scanId]/compare', component: 'ScanComparison', file: 'results/ScanComparison' },
  { path: 'dashboard/targets', component: 'TargetsList', file: 'targets/TargetsList' },
  { path: 'dashboard/targets/[targetId]', component: 'TargetDetail', file: 'targets/TargetDetail' },
  { path: 'dashboard/team', component: 'TeamMembers', file: 'team/TeamMembers' },
  { path: 'dashboard/settings', component: 'SettingsPage', file: 'settings/SettingsPage' },
];

const basePath = 'd:/DAST/figma/src/app';

pages.forEach(p => {
  const dirPath = path.join(basePath, p.path);
  fs.mkdirSync(dirPath, { recursive: true });
  
  // Calculate relative path to components
  // path.relative(dirPath, 'd:/DAST/figma/src/components')
  const levels = p.path ? p.path.split('/').length : 0;
  const rel = levels > 0 ? '../'.repeat(levels) : './';
  
  const content = `import { ${p.component} } from '${rel}components/${p.file}';\n\nexport default function Page() {\n  return <${p.component} />;\n}\n`;
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);

  if (p.layout) {
    const layoutContent = `import { AppLayout } from '${rel}components/layout/AppLayout';\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <AppLayout>{children}</AppLayout>;\n}\n`;
    fs.writeFileSync(path.join(basePath, 'dashboard', 'layout.tsx'), layoutContent);
  }
});

// Root layout
fs.writeFileSync(path.join(basePath, 'layout.tsx'), `import '../styles/globals.css';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n`);

console.log("Next.js pages generated.");
