import { Suspense } from 'react';
import { LiveScanMonitor } from '../../../../components/scanning/LiveScanMonitor';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LiveScanMonitor />
    </Suspense>
  );
}
