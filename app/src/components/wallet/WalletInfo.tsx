/**
 * Wallet Info Component
 * 
 * Displays wallet connection status and account details.
 * Used in dashboard for quick account overview.
 */

'use client';

import { useWallet } from '@/contexts/WalletContext';
import { Card } from '@/components/ui/Card';
import { Wallet, Copy, ExternalLink, CheckCircle } from 'lucide-react';
import { shortenAddress } from '@/lib/utils/formatters';
import { copyToClipboard } from '@/lib/utils/helpers';
import { useState } from 'react';

export function WalletInfo() {
  const { selectedAccount, isConnected } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!isConnected || !selectedAccount) {
    return null;
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(selectedAccount.address);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getExplorerUrl = (address: string) => {
    return `https://polkadot.subscan.io/account/${address}`;
  };

  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--polkadot-pink)]/10">
        <Wallet className="h-6 w-6 text-[var(--polkadot-pink)]" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text-secondary)]">Connected Wallet</p>
        <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
          {selectedAccount.name || 'Unnamed Account'}
        </p>
        <p className="font-mono text-xs text-[var(--text-secondary)]">
          {shortenAddress(selectedAccount.address, 8)}
        </p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--hover)] hover:text-[var(--text-primary)] transition-colors"
          title="Copy address"
        >
          {copied ? (
            <CheckCircle className="h-4 w-4 text-[var(--success)]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
        
        <a
          href={getExplorerUrl(selectedAccount.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--hover)] hover:text-[var(--text-primary)] transition-colors"
          title="View on explorer"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}


