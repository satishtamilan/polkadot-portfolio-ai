/**
 * Moonbeam Network Integration
 * 
 * BLOCKCHAIN CONCEPT: Moonbeam
 * ============================
 * Moonbeam is an Ethereum-compatible smart contract parachain.
 * It provides:
 * - Full Ethereum compatibility (Solidity, Web3.js)
 * - Cross-chain bridges (Ethereum, BSC, etc.)
 * - Native Substrate features
 * - Interoperability with Polkadot ecosystem
 * 
 * Learn more: https://docs.moonbeam.network/
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import { ChainBalance, ChainId } from '@/types';
import { CHAINS } from '@/lib/utils/constants';
import { safeQuery } from './base';

const config = CHAINS.moonbeam;

/**
 * Create API connection to Moonbeam
 */
async function createApi(useFallback = false): Promise<ApiPromise> {
  const rpc = useFallback && config.fallbackRpc ? config.fallbackRpc : config.rpc;
  const wsProvider = new WsProvider(rpc);
  const api = await ApiPromise.create({ provider: wsProvider });
  return api;
}

/**
 * Query GLMR balance for an account
 * 
 * Moonbeam uses 18 decimals (Ethereum standard)
 * 1 GLMR = 1,000,000,000,000,000,000 (10^18)
 * 
 * @param address - Moonbeam address
 * @returns Balance information
 */
export async function getMoonbeamBalance(address: string): Promise<ChainBalance> {
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
export async function queryMoonbeamBalance(address: string) {
  return safeQuery(
    () => getMoonbeamBalance(address),
    'Failed to fetch Moonbeam balance. The network might be experiencing issues.'
  );
}

/**
 * Get Moonbeam chain configuration
 */
export function getMoonbeamConfig() {
  return config;
}


