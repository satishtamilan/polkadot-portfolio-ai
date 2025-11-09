/**
 * Portfolio Calculation Utilities
 * 
 * Functions for aggregating chain data and calculating portfolio value.
 */

import { ChainBalance, Portfolio, ChainPortfolio, TokenPrice, ChainId } from '@/types';
import { CHAINS } from './constants';

/**
 * Calculate USD value for a balance
 * 
 * @param balance - Token balance (as string)
 * @param decimals - Token decimals
 * @param priceUsd - Price per token in USD
 * @returns USD value
 */
export function calculateUsdValue(
  balance: string,
  decimals: number,
  priceUsd: number
): number {
  if (!balance || priceUsd === 0) return 0;
  
  const numBalance = Number(balance) / Math.pow(10, decimals);
  return numBalance * priceUsd;
}

/**
 * Format balance from raw string to human-readable number
 * 
 * @param balance - Raw balance string
 * @param decimals - Token decimals
 * @returns Formatted balance as number
 */
export function formatBalance(
  balance: string,
  decimals: number
): number {
  if (!balance) return 0;
  return Number(balance) / Math.pow(10, decimals);
}

/**
 * Aggregate balances into portfolio
 * 
 * @param balances - Map of chain IDs to balance data
 * @param prices - Map of token symbols to prices
 * @returns Complete portfolio data
 */
export function aggregatePortfolio(
  balances: Map<ChainId, ChainBalance | null>,
  prices: Map<string, TokenPrice>
): Portfolio {
  const chainPortfolios: ChainPortfolio[] = [];
  let totalValue = 0;

  // Process each chain
  for (const [chainId, balance] of balances.entries()) {
    if (!balance) continue;

    const chainConfig = CHAINS[chainId];
    const price = prices.get(chainConfig.token);
    const priceUsd = price?.usd || 0;
    const change24h = price?.change24h || 0;

    // Calculate chain value
    const chainValue = calculateUsdValue(
      balance.total,
      chainConfig.decimals,
      priceUsd
    );

    // Format balance for human readability
    const formattedBalance = formatBalance(balance.total, chainConfig.decimals);

    totalValue += chainValue;

    chainPortfolios.push({
      chain: chainId,
      chainName: chainConfig.name,
      token: chainConfig.token,
      balance: formattedBalance, // Formatted balance
      balances: [{ ...balance, usdValue: chainValue }],
      totalValue: chainValue,
      percentage: 0, // Will be calculated after we know total
      change24h: change24h
    });
  }

  // Calculate percentages
  chainPortfolios.forEach((cp) => {
    cp.percentage = totalValue > 0 ? (cp.totalValue / totalValue) * 100 : 0;
  });

  // Aggregate tokens (for multi-token support in future)
  const tokenMap = new Map<string, {
    symbol: string;
    totalAmount: string;
    totalValue: number;
    chains: ChainId[];
  }>();

  for (const [chainId, balance] of balances.entries()) {
    if (!balance) continue;

    const chainConfig = CHAINS[chainId];
    const existing = tokenMap.get(chainConfig.token);

    if (existing) {
      existing.chains.push(chainId);
      // Note: Adding balances across chains with different decimals needs careful handling
      // For now, we just track chains where token exists
    } else {
      const price = prices.get(chainConfig.token);
      const priceUsd = price?.usd || 0;
      const value = calculateUsdValue(balance.total, chainConfig.decimals, priceUsd);

      tokenMap.set(chainConfig.token, {
        symbol: chainConfig.token,
        totalAmount: balance.total,
        totalValue: value,
        chains: [chainId]
      });
    }
  }

  return {
    totalValue,
    chains: chainPortfolios,
    tokens: Array.from(tokenMap.values()),
    lastUpdated: Date.now()
  };
}


