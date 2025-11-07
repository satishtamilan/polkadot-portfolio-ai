/**
 * Central export for all TypeScript types
 * 
 * This barrel file makes imports cleaner:
 * Instead of: import { Account } from './types/wallet';
 * We can do:    import { Account } from './types';
 */

// Wallet types
export type {
  Account,
  WalletState,
  WalletContextType
} from './wallet';

// Chain types
export type {
  ChainId,
  ChainConfig,
  ChainBalance,
  Transaction,
  ChainData,
  QueryResult,
  MultiChainState
} from './chain';

// Portfolio types
export type {
  TokenPrice,
  ChainPortfolio,
  Portfolio,
  ChartDataPoint,
  PortfolioStats
} from './portfolio';

