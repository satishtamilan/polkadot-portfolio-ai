/**
 * Portfolio-related TypeScript types
 * 
 * BLOCKCHAIN CONCEPT: Portfolio Value
 * ====================================
 * Your Web3 portfolio spans multiple chains. To get the complete picture:
 * 1. Query each chain for balances
 * 2. Fetch current token prices (USD)
 * 3. Calculate: balance * price for each token
 * 4. Sum all values = Total Portfolio Value
 */

import { ChainBalance, ChainId } from './chain';

/**
 * Token price information
 */
export interface TokenPrice {
  /** Token symbol */
  symbol: string;
  
  /** Current price in USD */
  usd: number;
  
  /** 24h price change percentage */
  change24h?: number;
  
  /** Last updated timestamp */
  lastUpdated: number;
}

/**
 * Portfolio breakdown by chain
 */
export interface ChainPortfolio {
  /** Chain identifier */
  chain: ChainId;
  
  /** Chain name */
  chainName: string;
  
  /** All balances on this chain */
  balances: ChainBalance[];
  
  /** Total value of all assets on this chain (USD) */
  totalValue: number;
  
  /** Percentage of total portfolio */
  percentage: number;
}

/**
 * Complete portfolio aggregation across all chains
 */
export interface Portfolio {
  /** Total portfolio value in USD */
  totalValue: number;
  
  /** Breakdown by chain */
  chains: ChainPortfolio[];
  
  /** All unique tokens held */
  tokens: {
    symbol: string;
    totalAmount: string;
    totalValue: number;
    chains: ChainId[];
  }[];
  
  /** 24h change in portfolio value (mocked for MVP) */
  change24h?: number;
  
  /** Last update timestamp */
  lastUpdated: number;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  /** Label (date, chain name, etc.) */
  label: string;
  
  /** Value */
  value: number;
  
  /** Optional additional data */
  [key: string]: any;
}

/**
 * Portfolio statistics
 */
export interface PortfolioStats {
  /** Number of chains with assets */
  activeChains: number;
  
  /** Total number of different tokens */
  uniqueTokens: number;
  
  /** Most valuable chain */
  topChain: {
    name: string;
    value: number;
  } | null;
  
  /** Distribution for pie chart */
  distribution: {
    chain: string;
    value: number;
    percentage: number;
    color: string;
  }[];
}

