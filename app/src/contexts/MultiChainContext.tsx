/**
 * Multi-Chain Context
 * 
 * Manages data from all chains and portfolio calculations.
 * Queries chains in parallel for better performance.
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from './WalletContext';
import { ChainBalance, ChainId, Portfolio } from '@/types';
import { queryPolkadotBalance } from '@/lib/chains/polkadot';
import { queryAstarBalance } from '@/lib/chains/astar';
import { queryMoonbeamBalance } from '@/lib/chains/moonbeam';
import { queryAcalaBalance } from '@/lib/chains/acala';
import { usePrices } from '@/hooks/usePrices';
import { aggregatePortfolio } from '@/lib/utils/portfolio';
import { REFRESH_INTERVALS, CHAIN_IDS } from '@/lib/utils/constants';

interface MultiChainState {
  balances: Map<ChainId, ChainBalance | null>;
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const MultiChainContext = createContext<MultiChainState | undefined>(undefined);

interface MultiChainProviderProps {
  children: ReactNode;
}

export function MultiChainProvider({ children }: MultiChainProviderProps) {
  const { selectedAccount, isConnected } = useWallet();
  const [balances, setBalances] = useState<Map<ChainId, ChainBalance | null>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch REAL prices from CoinGecko for display tokens
  const { prices } = usePrices(['DOT', 'ASTR', 'GLMR'], isConnected);

  /**
   * Fetch balances from all chains in parallel
   */
  const fetchAllBalances = async () => {
    if (!selectedAccount?.address || !isConnected) {
      setBalances(new Map());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Query all chains in parallel using Promise.allSettled
      // This ensures one chain failure doesn't block others
      const results = await Promise.allSettled([
        queryPolkadotBalance(selectedAccount.address),
        queryAstarBalance(selectedAccount.address),
        queryMoonbeamBalance(selectedAccount.address),
        // queryAcalaBalance(selectedAccount.address) // Temporarily disabled
      ]);

      const newBalances = new Map<ChainId, ChainBalance | null>();

      // Process results
      results.forEach((result, index) => {
        const chainId = CHAIN_IDS[index];
        
        if (result.status === 'fulfilled' && result.value.success) {
          newBalances.set(chainId, result.value.data);
        } else {
          newBalances.set(chainId, null);
          console.error(`Failed to fetch ${chainId} balance:`, 
            result.status === 'rejected' ? result.reason : result.value.error);
        }
      });

      setBalances(newBalances);
    } catch (err) {
      setError('Failed to fetch chain balances');
      console.error('Multi-chain fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch balances when wallet connects or account changes
  useEffect(() => {
    fetchAllBalances();
  }, [selectedAccount?.address, isConnected]);

  // Auto-refresh balances
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(fetchAllBalances, REFRESH_INTERVALS.chainData);
    return () => clearInterval(interval);
  }, [isConnected, selectedAccount?.address]);

  // Calculate portfolio
  const portfolio = balances.size > 0 && prices.size > 0
    ? aggregatePortfolio(balances, prices)
    : null;

  const value: MultiChainState = {
    balances,
    portfolio,
    isLoading,
    error,
    refetch: fetchAllBalances
  };

  return (
    <MultiChainContext.Provider value={value}>
      {children}
    </MultiChainContext.Provider>
  );
}

/**
 * useMultiChain Hook
 * 
 * Access multi-chain data and portfolio calculations
 */
export function useMultiChain() {
  const context = useContext(MultiChainContext);
  
  if (context === undefined) {
    throw new Error('useMultiChain must be used within MultiChainProvider');
  }
  
  return context;
}

