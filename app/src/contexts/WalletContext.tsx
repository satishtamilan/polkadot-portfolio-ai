/**
 * Wallet Context
 * 
 * Global state management for wallet connection.
 * Provides wallet state and functions to all components.
 * 
 * REACT PATTERN: Context API
 * =========================
 * React Context allows sharing state across component tree
 * without prop drilling. Perfect for global state like wallet.
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connectWallet, isExtensionAvailable } from '@/lib/polkadot/connection';
import { Account, WalletContextType } from '@/types';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/lib/utils/helpers';
import { STORAGE_KEYS } from '@/lib/utils/constants';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On mount, check if user was previously connected
  useEffect(() => {
    const savedAddress = getLocalStorage(STORAGE_KEYS.selectedAccount);
    if (savedAddress) {
      // Auto-connect if previously connected
      handleConnect().catch(console.error);
    }
  }, []);

  /**
   * Connect to wallet
   * 
   * Initiates connection flow:
   * 1. Check if extension is available
   * 2. Request connection
   * 3. Fetch accounts
   * 4. Select first account (or previously selected)
   */
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if extension is installed
      if (!isExtensionAvailable()) {
        throw new Error(
          'Polkadot.js extension not detected. Please install it and refresh the page.'
        );
      }

      // Connect and get accounts
      const fetchedAccounts = await connectWallet();
      setAccounts(fetchedAccounts);

      // Select account
      const savedAddress = getLocalStorage(STORAGE_KEYS.selectedAccount);
      const accountToSelect = 
        fetchedAccounts.find(acc => acc.address === savedAddress) ||
        fetchedAccounts[0];

      setSelectedAccount(accountToSelect);
      setLocalStorage(STORAGE_KEYS.selectedAccount, accountToSelect.address);
      setIsConnected(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnect wallet
   * 
   * Clears all wallet state and removes from localStorage
   */
  const handleDisconnect = () => {
    setAccounts([]);
    setSelectedAccount(null);
    setIsConnected(false);
    setError(null);
    removeLocalStorage(STORAGE_KEYS.selectedAccount);
  };

  /**
   * Select different account
   * 
   * Allows user to switch between their accounts
   */
  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setLocalStorage(STORAGE_KEYS.selectedAccount, account.address);
  };

  const value: WalletContextType = {
    accounts,
    selectedAccount,
    isConnected,
    isConnecting,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect,
    selectAccount: handleSelectAccount
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

/**
 * useWallet Hook
 * 
 * Custom hook to access wallet context.
 * Use this in components instead of useContext directly.
 * 
 * @example
 * const { isConnected, connect, selectedAccount } = useWallet();
 */
export function useWallet() {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  
  return context;
}


