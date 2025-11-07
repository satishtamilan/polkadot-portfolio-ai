/**
 * Astar Network Integration
 * 
 * BLOCKCHAIN CONCEPT: Astar Network
 * ==================================
 * Astar is a multi-chain dApp hub on Polkadot that supports:
 * - EVM (Ethereum Virtual Machine) - deploy Solidity contracts
 * - WASM (WebAssembly) - deploy Rust contracts
 * - dApp Staking - earn rewards by staking on dApps
 * - Cross-chain messaging (XCM)
 * 
 * Learn more: https://docs.astar.network/
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import { ChainBalance, ChainId } from '@/types';
import { CHAINS } from '@/lib/utils/constants';
import { safeQuery } from './base';

const config = CHAINS.astar;

/**
 * Create API connection to Astar Network
 */
async function createApi(useFallback = false): Promise<ApiPromise> {
  const rpc = useFallback && config.fallbackRpc ? config.fallbackRpc : config.rpc;
  const wsProvider = new WsProvider(rpc);
  const api = await ApiPromise.create({ provider: wsProvider });
  return api;
}

/**
 * Query ASTR balance for an account
 * 
 * Astar uses 18 decimals
 * 1 ASTR = 1,000,000,000,000,000,000 (10^18)
 * 
 * @param address - Astar address
 * @returns Balance information
 */
export async function getAstarBalance(address: string): Promise<ChainBalance> {
  let api: ApiPromise | null = null;
  
  try {
    api = await createApi();
    
    // Query account data
    const accountInfo = await api.query.system.account(address);
    const data = accountInfo.data;
    
    const free = data.free.toString();
    const reserved = data.reserved.toString();
    const frozen = data.frozen?.toString() || '0';
    const total = data.free.add(data.reserved).toString();
    
    return {
      chain: config.id as ChainId,
      token: config.token,
      free,
      reserved,
      frozen,
      total,
      usdValue: 0
    };
  } finally {
    if (api) {
      await api.disconnect();
    }
  }
}

/**
 * Query balance with error handling
 */
export async function queryAstarBalance(address: string) {
  return safeQuery(
    () => getAstarBalance(address),
    'Failed to fetch Astar balance. The network might be experiencing issues.'
  );
}

/**
 * Get Astar chain configuration
 */
export function getAstarConfig() {
  return config;
}


