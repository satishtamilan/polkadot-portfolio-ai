/**
 * Account Selector Component
 * 
 * Allows user to switch between their accounts.
 * Shows all available accounts from wallet extension.
 */

'use client';

import { useWallet } from '@/contexts/WalletContext';
import { shortenAddress } from '@/lib/utils/formatters';
import { Check } from 'lucide-react';
import { Account } from '@/types';

interface AccountSelectorProps {
  onClose?: () => void;
}

export function AccountSelector({ onClose }: AccountSelectorProps) {
  const { accounts, selectedAccount, selectAccount } = useWallet();

  const handleSelect = (account: Account) => {
    selectAccount(account);
    onClose?.();
  };

  if (accounts.length <= 1) {
    return null;
  }

  return (
    <div className="max-h-64 overflow-y-auto">
      <div className="p-2">
        <p className="px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
          Switch Account
        </p>
        {accounts.map((account) => {
          const isSelected = account.address === selectedAccount?.address;
          
          return (
            <button
              key={account.address}
              onClick={() => handleSelect(account)}
              className={`
                flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-colors
                ${isSelected 
                  ? 'bg-[var(--polkadot-pink)]/10 text-[var(--polkadot-pink)]' 
                  : 'text-[var(--text-primary)] hover:bg-[var(--hover)]'
                }
              `}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {account.name || 'Unnamed Account'}
                </p>
                <p className="font-mono text-xs text-[var(--text-secondary)]">
                  {shortenAddress(account.address, 6)}
                </p>
              </div>
              {isSelected && (
                <Check className="h-4 w-4 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


