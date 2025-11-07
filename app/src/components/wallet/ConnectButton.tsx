/**
 * Connect Wallet Button Component
 * 
 * Main entry point for wallet connection.
 * Shows different states: disconnected, connecting, connected.
 */

'use client';

import { Button } from '@/components/ui/Button';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet, ChevronDown, LogOut } from 'lucide-react';
import { shortenAddress } from '@/lib/utils/formatters';
import { useState, useRef, useEffect } from 'react';
import { AccountSelector } from './AccountSelector';

export function ConnectButton() {
  const { isConnected, isConnecting, connect, disconnect, selectedAccount, error } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If not connected, show connect button
  if (!isConnected) {
    return (
      <div>
        <Button
          onClick={connect}
          loading={isConnecting}
          disabled={isConnecting}
          variant="primary"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
        {error && (
          <p className="mt-2 text-sm text-[var(--error)]">
            {error}
          </p>
        )}
      </div>
    );
  }

  // If connected, show account dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setShowDropdown(!showDropdown)}
        variant="secondary"
        className="min-w-[180px]"
      >
        <Wallet className="mr-2 h-4 w-4" />
        <span className="flex-1 text-left">
          {selectedAccount?.name || shortenAddress(selectedAccount?.address || '')}
        </span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-[var(--card-border)] bg-[var(--card-background)] shadow-lg z-50">
          <div className="p-3 border-b border-[var(--card-border)]">
            <p className="text-xs text-[var(--text-secondary)]">Connected Account</p>
            <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
              {selectedAccount?.name || 'Unnamed Account'}
            </p>
            <p className="mt-1 font-mono text-xs text-[var(--text-secondary)]">
              {shortenAddress(selectedAccount?.address || '', 8)}
            </p>
          </div>
          
          <AccountSelector onClose={() => setShowDropdown(false)} />
          
          <div className="p-2 border-t border-[var(--card-border)]">
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-[var(--error)] hover:bg-[var(--hover)] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


