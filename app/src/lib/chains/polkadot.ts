/**
 * Polkadot Relay Chain Integration
 * 
 * BLOCKCHAIN CONCEPT: Polkadot Relay Chain
 * ========================================
 * The Relay Chain is the heart of Polkadot. It provides:
 * - Shared security for all parachains
 * - Cross-chain communication (XCM)
 * - Consensus and validation
 * 
 * Users hold DOT tokens on the Relay Chain for:
 * - Staking (securing the network)
 * - Governance (voting on proposals)
 * - Bonding (connecting parachains)
 * 
 * Learn more: https://wiki.polkadot.network/docs/learn-architecture
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import { ChainBalance, ChainId } from '@/types';
import { CHAINS } from '@/lib/utils/constants';
import { safeQuery } from './base';

const config = CHAINS.polkadot;

/**
 * Create API connection to Polkadot Relay Chain
 * 
 * This establishes a WebSocket connection to a Polkadot node.
 * The node provides access to blockchain data and state.
 */
async function createApi(useFallback = false): Promise<ApiPromise> {
  const rpc = useFallback && config.fallbackRpc ? config.fallbackRpc : config.rpc;
  const wsProvider = new WsProvider(rpc);
  
  // Create API instance
  // This connects to the chain and loads type definitions
  const api = await ApiPromise.create({ provider: wsProvider });
  
  return api;
}

/**
 * Query DOT balance for an account
 * 
 * BLOCKCHAIN CONCEPT: Account Balances
 * ===================================
 * In Substrate (Polkadot's framework), account data includes:
 * - free: Balance you can transfer
 * - reserved: Locked for operations (identity, democracy)
 * - frozen: Locked in staking, governance, vesting
 * 
 * Available to spend = free - frozen
 * Total balance = free + reserved
 * 
 * DOT uses 10 decimal places (Planck units)
 * 1 DOT = 10,000,000,000 Planck
 * 
 * @param address - Polkadot address (SS58 format)
 * @returns Balance information
 */
export async function getPolkadotBalance(address: string): Promise<ChainBalance> {
  let api: ApiPromise | null = null;
  
  try {
    api = await createApi();
    
    // Query account data from system.account storage
    // This is a standard Substrate pallet available on all chains
    const accountInfo = await api.query.system.account(address);
    const data = accountInfo.data;
    
    // Extract balance components
    // All values are BigNumber-like, convert to string for safe handling
    const free = data.free.toString();
    const reserved = data.reserved.toString();
    const frozen = data.frozen?.toString() || '0';
    
    // Calculate total (free + reserved)
    const total = data.free.add(data.reserved).toString();
    
    return {
      chain: config.id as ChainId,
      token: config.token,
      free,
      reserved,
      frozen,
      total,
      usdValue: 0 // Will be calculated later with price data
    };
  } finally {
    // Always disconnect to prevent memory leaks
    if (api) {
      await api.disconnect();
    }
  }
}

/**
 * Query balance with error handling
 * 
 * Wraps getPolkadotBalance with try/catch for safe usage
 */
export async function queryPolkadotBalance(address: string) {
  return safeQuery(
    () => getPolkadotBalance(address),
    'Failed to fetch Polkadot balance. The network might be experiencing issues.'
  );
}

/**
 * Get Polkadot chain configuration
 */
export function getPolkadotConfig() {
  return config;
}


