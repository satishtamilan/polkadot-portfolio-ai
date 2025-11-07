/**
 * Chain-related TypeScript types
 * 
 * BLOCKCHAIN CONCEPT: Parachains
 * ===============================
 * Polkadot is a "Layer 0" blockchain that hosts multiple "Layer 1" parachains.
 * Each parachain is its own blockchain with unique features, but they all
 * share Polkadot's security and can communicate with each other (XCM).
 * 
 * Think of it like:
 * - Polkadot Relay Chain = Operating System
 * - Parachains = Applications running on that OS
 * 
 * Learn more: https://wiki.polkadot.network/docs/learn-parachains
 */

/**
 * Supported chain identifiers
 */
export type ChainId = 'polkadot' | 'astar' | 'moonbeam' | 'acala';

/**
 * Configuration for a blockchain
 */
export interface ChainConfig {
  /** Unique identifier */
  id: ChainId;
  
  /** Human-readable name */
  name: string;
  
  /** Native token symbol (DOT, ASTR, GLMR, ACA) */
  token: string;
  
  /** 
   * Number of decimal places for the token
   * DOT has 10 decimals, most others have 18 (like Ethereum)
   * 
   * Example: If balance is "1000000000000" with 10 decimals,
   * the actual value is 100.0 DOT
   */
  decimals: number;
  
  /** WebSocket RPC endpoint to connect to the chain */
  rpc: string;
  
  /** Backup RPC in case primary fails */
  fallbackRpc?: string;
  
  /** Block explorer URL for viewing transactions */
  explorer: string;
  
  /** UI color for this chain */
  color: string;
  
  /** Optional logo URL */
  logo?: string;
}

/**
 * Balance information for an account on a specific chain
 * 
 * BLOCKCHAIN CONCEPT: Account Balance Types
 * ==========================================
 * In Substrate (Polkadot's framework), balances are split into:
 * - free: Balance you can transfer freely
 * - reserved: Balance locked for operations (like creating identities)
 * - frozen: Balance locked in staking, governance, etc.
 * 
 * Total spendable = free - frozen
 */
export interface ChainBalance {
  /** Which chain this balance is on */
  chain: ChainId;
  
  /** Token symbol */
  token: string;
  
  /** 
   * Free balance (as string to avoid JavaScript number precision issues)
   * Example: "10000000000" (represents 1.0 DOT with 10 decimals)
   */
  free: string;
  
  /**
   * Reserved balance (locked for operations)
   */
  reserved: string;
  
  /**
   * Frozen balance (staking, governance, etc.)
   */
  frozen: string;
  
  /**
   * Total balance (free + reserved)
   */
  total: string;
  
  /**
   * Value in USD (calculated from price API)
   */
  usdValue: number;
  
  /**
   * Formatted balance for display (e.g., "1.0000 DOT")
   */
  formatted?: string;
}

/**
 * Transaction information
 * 
 * BLOCKCHAIN CONCEPT: Extrinsics
 * ===============================
 * In Substrate, transactions are called "extrinsics". They can be:
 * - Transfer: Send tokens to another account
 * - Stake: Lock tokens for validation rewards
 * - Vote: Participate in governance
 * - And many more...
 */
export interface Transaction {
  /** Transaction hash (unique identifier) */
  hash: string;
  
  /** Which chain this transaction occurred on */
  chain: ChainId;
  
  /** Block number where transaction was included */
  blockNumber: number;
  
  /** Unix timestamp (milliseconds) */
  timestamp: number;
  
  /** Transaction type */
  type: 'transfer' | 'stake' | 'unstake' | 'vote' | 'other';
  
  /** From address */
  from: string;
  
  /** To address (if applicable) */
  to?: string;
  
  /** Amount (as string) */
  amount?: string;
  
  /** Transaction status */
  success: boolean;
  
  /** Link to block explorer */
  explorerUrl: string;
}

/**
 * Complete data for a single chain
 */
export interface ChainData {
  /** Chain configuration */
  config: ChainConfig;
  
  /** Balance information */
  balance: ChainBalance | null;
  
  /** Recent transactions */
  transactions: Transaction[];
  
  /** Whether data is currently being fetched */
  isLoading: boolean;
  
  /** Any error that occurred */
  error: string | null;
  
  /** Last update timestamp */
  lastUpdated: number | null;
}

/**
 * Query result that may succeed or fail
 */
export type QueryResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; userMessage: string };

/**
 * State of all chains for the connected account
 */
export interface MultiChainState {
  /** Data for each supported chain */
  chains: Record<ChainId, ChainData>;
  
  /** Whether any chain is loading */
  isLoading: boolean;
  
  /** Whether data is being refreshed */
  isRefreshing: boolean;
}

