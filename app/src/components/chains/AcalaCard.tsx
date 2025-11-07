/**
 * Acala Card Component
 * 
 * Displays ACA balance and information from Acala Network.
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useWallet } from '@/contexts/WalletContext';
import { useChainBalance } from '@/hooks/useChainBalance';
import { queryAcalaBalance, getAcalaConfig } from '@/lib/chains/acala';
import { formatBalance, formatUSD } from '@/lib/utils/formatters';
import { ExternalLink, RefreshCw } from 'lucide-react';

export function AcalaCard() {
  const { selectedAccount, isConnected } = useWallet();
  const { balance, isLoading, error, refetch } = useChainBalance(
    queryAcalaBalance,
    selectedAccount?.address || null,
    { enabled: isConnected }
  );

  const config = getAcalaConfig();

  if (!isConnected) {
    return null;
  }

  if (isLoading && !balance) {
    return (
      <Card className="relative">
        <div className="absolute right-4 top-4">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: config.color }} />
        </div>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" className="h-10 w-10" />
            <div className="flex-1">
              <Skeleton variant="text" className="h-5 w-32" />
              <Skeleton variant="text" className="mt-2 h-4 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton variant="text" className="h-8 w-48" />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Skeleton variant="rect" className="h-16" />
            <Skeleton variant="rect" className="h-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{config.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={error} onRetry={refetch} variant="inline" />
        </CardContent>
      </Card>
    );
  }

  if (!balance) {
    return null;
  }

  const freeBalance = formatBalance(balance.free, config.decimals, 4);
  const totalBalance = formatBalance(balance.total, config.decimals, 4);

  return (
    <Card className="relative" hover>
      <div className="absolute right-4 top-4">
        <div 
          className="h-3 w-3 rounded-full" 
          style={{ backgroundColor: config.color }}
          title={config.name}
        />
      </div>

      <CardHeader>
        <div className="flex items-center gap-3">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white"
            style={{ backgroundColor: config.color }}
          >
            {config.token[0]}
          </div>
          <div>
            <CardTitle>{config.name}</CardTitle>
            <p className="text-sm text-[var(--text-secondary)]">{config.token}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-[var(--text-secondary)]">Total Balance</p>
          <p className="mt-1 text-3xl font-bold text-[var(--text-primary)]">
            {totalBalance} {config.token}
          </p>
          {balance.usdValue > 0 && (
            <p className="mt-1 text-lg text-[var(--text-secondary)]">
              {formatUSD(balance.usdValue)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[var(--hover)] p-3">
            <p className="text-xs text-[var(--text-secondary)]">Available</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {freeBalance}
            </p>
          </div>
          <div className="rounded-lg bg-[var(--hover)] p-3">
            <p className="text-xs text-[var(--text-secondary)]">Reserved</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {formatBalance(balance.reserved, config.decimals, 4)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <a
            href={`${config.explorer}/account/${selectedAccount?.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--acala-red)] transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </a>
          
          <button
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}


