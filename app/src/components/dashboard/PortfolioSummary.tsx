/**
 * Portfolio Summary Component
 * 
 * Shows overview of total portfolio value across all chains.
 * Calculates from actual chain data and prices.
 */

'use client';

import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { formatUSD, formatPercent } from '@/lib/utils/formatters';
import { useMultiChain } from '@/contexts/MultiChainContext';
import { Skeleton } from '@/components/ui/Spinner';

export function PortfolioSummary() {
  const { portfolio, isLoading } = useMultiChain();

  if (isLoading && !portfolio) {
    return (
      <Card gradient>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant="circle" className="h-12 w-12" />
              <div className="flex-1">
                <Skeleton variant="text" className="h-4 w-24" />
                <Skeleton variant="text" className="mt-2 h-6 w-32" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const totalValue = portfolio?.totalValue || 0;
  const change24h = portfolio?.change24h || 0;
  const activeChains = portfolio?.chains.filter(c => c.totalValue > 0).length || 0;

  return (
    <Card gradient>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Portfolio Value */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--polkadot-pink)]/10">
              <DollarSign className="h-6 w-6 text-[var(--polkadot-pink)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Value</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {totalValue > 0 ? formatUSD(totalValue) : formatUSD(0)}
              </p>
            </div>
          </div>
        </div>

        {/* 24h Change */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
              change24h >= 0 ? 'bg-[var(--success)]/10' : 'bg-[var(--error)]/10'
            }`}>
              {change24h >= 0 ? (
                <TrendingUp className="h-6 w-6 text-[var(--success)]" />
              ) : (
                <TrendingDown className="h-6 w-6 text-[var(--error)]" />
              )}
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">24h Change</p>
              <p className={`text-2xl font-bold ${
                change24h >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'
              }`}>
                {change24h !== 0 ? formatPercent(change24h / 100) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Active Chains */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--astar-blue)]/10">
              <Activity className="h-6 w-6 text-[var(--astar-blue)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Active Chains</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {activeChains}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chain breakdown */}
      {portfolio && portfolio.chains.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {portfolio.chains.map((chain) => (
            <div key={chain.chain} className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3">
              <p className="text-xs text-[var(--text-secondary)]">{chain.chainName}</p>
              <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                {chain.totalValue > 0 ? formatUSD(chain.totalValue) : '$0.00'}
              </p>
              {chain.percentage > 0 && (
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {chain.percentage.toFixed(1)}%
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info note */}
      {totalValue === 0 && !isLoading && (
        <div className="mt-4 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3">
          <p className="text-sm text-[var(--text-secondary)]">
            💡 Your portfolio value will appear here once price data is loaded.
            Prices are fetched from CoinGecko API.
          </p>
        </div>
      )}
    </Card>
  );
}
