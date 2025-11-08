/**
 * Dashboard Layout Component
 * 
 * Main container for the portfolio dashboard.
 * Displays chain cards, portfolio summary, and activity.
 */

'use client';

import { useWallet } from '@/contexts/WalletContext';
import { WalletInfo } from '@/components/wallet/WalletInfo';
import { PortfolioSummary } from './PortfolioSummary';
import { PolkadotCard } from '@/components/chains/PolkadotCard';
import { AstarCard } from '@/components/chains/AstarCard';
import { MoonbeamCard } from '@/components/chains/MoonbeamCard';
import { AcalaCard } from '@/components/chains/AcalaCard';
import { PortfolioPieChart } from '@/components/charts/PortfolioPieChart';
import { AIAdvisor } from '@/components/ai/AIAdvisor';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function DashboardLayout() {
  const { isConnected, connect } = useWallet();

  // Show connect prompt if not connected
  if (!isConnected) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--polkadot-pink)]/10">
            <Wallet className="h-10 w-10 text-[var(--polkadot-pink)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Connect Your Wallet
          </h2>
          <p className="mt-3 text-[var(--text-secondary)]">
            Connect your Polkadot.js wallet to view your cross-chain portfolio
            and track assets across multiple parachains.
          </p>
          <Button onClick={connect} variant="primary" className="mt-6" size="lg">
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </Button>
          <div className="mt-6 rounded-lg border border-[var(--card-border)] bg-[var(--card-background)] p-4 text-left">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Don't have a wallet?
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Install the Polkadot.js extension to get started:
            </p>
            <a
              href="https://polkadot.js.org/extension/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-[var(--polkadot-pink)] hover:underline"
            >
              Download Extension →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard when connected
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* Main Content - Left Side */}
      <div className="space-y-6">
        {/* Wallet Info */}
        <WalletInfo />

        {/* Portfolio Summary */}
        <PortfolioSummary />

        {/* Chain Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <PolkadotCard />
          <AstarCard />
          <MoonbeamCard />
          {/* <AcalaCard /> Temporarily disabled */}
        </div>

        {/* Visualization */}
        <PortfolioPieChart />
      </div>

      {/* AI Portfolio Advisor - Right Sidebar (Sticky) */}
      <div className="lg:sticky lg:top-20 lg:h-fit">
        <AIAdvisor />
      </div>
    </div>
  );
}

