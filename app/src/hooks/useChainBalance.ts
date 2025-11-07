/**
 * useChainBalance Hook
 * 
 * React hook for fetching and managing chain balance data.
 * Handles loading states, errors, and auto-refresh.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChainBalance } from '@/types';
import { QueryResult } from '@/lib/chains/base';

interface UseChainBalanceOptions {
  enabled?: boolean;
  refetchInterval?: number; // in milliseconds
}

interface UseChainBalanceResult {
  balance: ChainBalance | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching balance from a specific chain
 * 
 * @param queryFn - Function that queries the chain
 * @param address - Account address to query
 * @param options - Configuration options
 */
export function useChainBalance(
  queryFn: (address: string) => Promise<QueryResult<ChainBalance>>,
  address: string | null,
  options: UseChainBalanceOptions = {}
): UseChainBalanceResult {
  const { enabled = true, refetchInterval = 30000 } = options; // Default 30s refresh
  
  const [balance, setBalance] = useState<ChainBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn(address);
      
      if (result.success) {
        setBalance(result.data);
      } else {
        setError(result.userMessage);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Balance fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, enabled, queryFn]);

  // Fetch on mount and when address/enabled changes
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Auto-refresh
  useEffect(() => {
    if (!enabled || !refetchInterval) return;

    const interval = setInterval(fetchBalance, refetchInterval);
    return () => clearInterval(interval);
  }, [enabled, refetchInterval, fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance
  };
}


