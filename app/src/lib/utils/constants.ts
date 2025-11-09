/**
 * Application constants
 * 
 * Centralized location for all configuration values that don't change.
 */

import { ChainConfig, ChainId } from '@/types';

/**
 * Application metadata
 */
export const APP_NAME = 'ChainLink Portfolio';
export const APP_DESCRIPTION = 'Cross-chain asset tracker for Polkadot Cloud';
export const APP_VERSION = '0.1.0';

/**
 * Chain Configurations
 * 
 * BLOCKCHAIN CONCEPT: RPC Endpoints
 * ==================================
 * To interact with a blockchain, we connect to an RPC (Remote Procedure Call) node.
 * Think of it like an API server for the blockchain.
 * 
 * - WSS (WebSocket Secure) connections allow real-time updates
 * - Public RPCs are free but may have rate limits
 * - You can also run your own node for unlimited access
 * 
 * Learn more: https://wiki.polkadot.network/docs/learn-get-started
 */
export const CHAINS: Record<ChainId, ChainConfig> = {
  polkadot: {
    id: 'polkadot',
    name: 'Polkadot', // Display name (using Paseo testnet RPC with real balances)
    token: 'DOT', // Display as DOT (but querying Paseo testnet)
    decimals: 10,
    rpc: 'wss://paseo.rpc.amforc.com', // Testnet RPC with YOUR balances
    fallbackRpc: 'wss://rpc.ibp.network/paseo',
    explorer: 'https://paseo.subscan.io',
    color: '#E6007A',
    logo: '/logos/polkadot.svg'
  },
  
  astar: {
    id: 'astar',
    name: 'Astar', // Display name (using Westend testnet RPC with real balances)
    token: 'ASTR', // Display as ASTR (but querying Westend testnet)
    decimals: 12, // KEEP ORIGINAL - don't change or balance breaks!
    rpc: 'wss://westend-rpc.polkadot.io', // Testnet RPC with YOUR balances
    fallbackRpc: 'wss://rpc.ibp.network/westend',
    explorer: 'https://westend.subscan.io',
    color: '#0070EB',
    logo: '/logos/astar.svg'
  },
  
  moonbeam: {
    id: 'moonbeam',
    name: 'Moonbeam', // Display name (using Westend Asset Hub RPC with real balances)
    token: 'GLMR', // Display as GLMR (but querying Westend Asset Hub)
    decimals: 12, // KEEP ORIGINAL - don't change or balance breaks!
    rpc: 'wss://westend-asset-hub-rpc.polkadot.io', // Testnet RPC with YOUR balances
    fallbackRpc: 'wss://sys.ibp.network/asset-hub-westend',
    explorer: 'https://assethub-westend.subscan.io',
    color: '#53CBC9',
    logo: '/logos/moonbeam.svg'
  },
  
  acala: {
    id: 'acala',
    name: 'Paseo Asset Hub', // Asset Hub on Paseo testnet - same network as Polkadot card!
    token: 'PAS', // Paseo tokens (same as your Polkadot card)
    decimals: 10, // Paseo uses 10 decimals like DOT
    rpc: 'wss://pas-rpc.stakeworld.io/assethub', // Paseo Asset Hub RPC
    fallbackRpc: 'wss://sys.ibp.network/asset-hub-paseo',
    explorer: 'https://assethub-paseo.subscan.io',
    color: '#FF6B6B', // Asset Hub red
    logo: '/logos/acala.svg'
  }
};

/**
 * List of all supported chain IDs
 */
export const CHAIN_IDS: ChainId[] = ['polkadot', 'astar', 'moonbeam', 'acala'];

/**
 * Token price API configuration
 * Using CoinGecko's free API (rate limited)
 */
export const PRICE_API = {
  baseUrl: 'https://api.coingecko.com/api/v3',
  // CoinGecko token IDs
  tokenIds: {
    DOT: 'polkadot',
    ASTR: 'astar',
    GLMR: 'moonbeam',
    ACA: 'acala'
  },
  // Cache prices for 5 minutes (300000 ms)
  cacheDuration: 5 * 60 * 1000
};

/**
 * Data refresh intervals (in milliseconds)
 */
export const REFRESH_INTERVALS = {
  // Refresh chain data every 30 seconds
  chainData: 30 * 1000,
  
  // Refresh prices every 5 minutes
  prices: 5 * 60 * 1000,
  
  // Refresh transactions every 60 seconds
  transactions: 60 * 1000
};

/**
 * Query timeout settings
 */
export const TIMEOUTS = {
  // Max time to wait for chain connection (10 seconds)
  chainConnection: 10 * 1000,
  
  // Max time to wait for balance query (5 seconds)
  balanceQuery: 5 * 1000,
  
  // Max time to wait for transaction query (10 seconds)
  transactionQuery: 10 * 1000,
  
  // Max time to wait for price API (3 seconds)
  priceApi: 3 * 1000
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  selectedAccount: 'chainlink_selected_account',
  theme: 'chainlink_theme',
  lastUpdate: 'chainlink_last_update'
};

/**
 * UI Constants
 */
export const UI = {
  // Maximum number of transactions to show in activity feed
  maxTransactions: 20,
  
  // Number of decimal places to show for token balances
  balanceDecimals: 4,
  
  // Number of decimal places to show for USD values
  usdDecimals: 2,
  
  // Minimum USD value to show in portfolio (hide dust)
  minPortfolioValue: 0.01
};

/**
 * External links
 */
export const LINKS = {
  polkadotDocs: 'https://wiki.polkadot.network/',
  polkadotJsDocs: 'https://polkadot.js.org/docs/',
  hackathon: 'https://polkadot.devpost.com/',
  github: 'https://github.com/yourusername/chainlink-portfolio',
  
  // Wallet extension downloads
  polkadotExtension: 'https://polkadot.js.org/extension/',
  subwallet: 'https://subwallet.app/',
  talisman: 'https://talisman.xyz/'
};

/**
 * Error messages
 */
export const ERRORS = {
  noExtension: 'Polkadot.js extension not found. Please install it from polkadot.js.org/extension/',
  noAccounts: 'No accounts found in your wallet. Please create an account first.',
  connectionFailed: 'Failed to connect to wallet. Please try again.',
  chainConnectionFailed: 'Failed to connect to blockchain. Please check your internet connection.',
  balanceQueryFailed: 'Failed to fetch balance. The chain might be experiencing issues.',
  priceApiFailed: 'Failed to fetch token prices. Displaying balances without USD values.',
  transactionQueryFailed: 'Failed to fetch transactions. This feature may be temporarily unavailable.'
};

