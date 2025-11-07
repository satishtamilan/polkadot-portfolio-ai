/**
 * Home Page
 * 
 * Main dashboard page for ChainLink Portfolio.
 * Shows wallet connection and cross-chain portfolio overview.
 */

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Dashboard
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          View your cross-chain portfolio across the Polkadot ecosystem
        </p>
      </div>
      
      <DashboardLayout />
    </div>
  );
}
