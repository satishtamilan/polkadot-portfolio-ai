/**
 * usePrices Hook
 * 
 * React hook for fetching token prices.
 * Handles loading states, errors, and caching.
 */

'use client';

import { useState, useEffect } from 'react';
import { TokenPrice } from '@/types';
import { fetchTokenPrices } from '@/lib/api/prices';
import { REFRESH_INTERVALS } from '@/lib/utils/constants';

interface UsePricesResult {
  prices: Map<string, TokenPrice>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching multiple token prices
 * 
 * @param symbols - Array of token symbols to fetch
 * @param enabled - Whether to fetch prices
 */
export function usePrices(
  symbols: string[],
  enabled: boolean = true
): UsePricesResult {
  const [prices, setPrices] = useState<Map<string, TokenPrice>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    if (!enabled || symbols.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const priceMap = await fetchTokenPrices(symbols);
      setPrices(priceMap);
    } catch (err) {
      setError('Failed to fetch token prices');
      console.error('Price fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and when symbols/enabled changes
  useEffect(() => {
    fetchPrices();
  }, [symbols.join(','), enabled]);

  // Auto-refresh prices
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(fetchPrices, REFRESH_INTERVALS.prices);
    return () => clearInterval(interval);
  }, [enabled, symbols.join(',')]);

  return {
    prices,
    isLoading,
    error,
    refetch: fetchPrices
  };
}


