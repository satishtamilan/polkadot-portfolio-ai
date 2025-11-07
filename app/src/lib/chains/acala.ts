/**
 * Acala Network Integration
 * 
 * BLOCKCHAIN CONCEPT: Acala - DeFi Hub
 * ====================================
 * Acala is the DeFi hub of Polkadot, providing:
 * - Decentralized stablecoin (aUSD)
 * - Liquid staking (LDOT - liquid DOT)
 * - DEX (Decentralized Exchange)
 * - DeFi primitives and protocols
 * 
 * Key features:
 * - Multi-collateral stablecoin system
 * - Stake DOT while keeping liquidity (LDOT)
 * - EVM+ (Ethereum compatibility with Substrate features)
 * 
 * Learn more: https://wiki.acala.network/
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import { ChainBalance, ChainId } from '@/types';
import { CHAINS } from '@/lib/utils/constants';
import { safeQuery } from './base';

const config = CHAINS.acala;

/**
 * Create API connection to Acala
 */
async function createApi(useFallback = false): Promise<ApiPromise> {
  const rpc = useFallback && config.fallbackRpc ? config.fallbackRpc : config.rpc;
  const wsProvider = new WsProvider(rpc);
  const api = await ApiPromise.create({ provider: wsProvider });
  return api;
}

/**
 * Query ACA balance for an account
 * 
 * Acala uses 12 decimals
 * 1 ACA = 1,000,000,000,000 (10^12)
 * 
 * Note: Acala also has other tokens (aUSD, LDOT) but for MVP
 * we're focusing on the native token ACA.
 * 
 * @param address - Acala address
 * @returns Balance information
 */
export async function getAcalaBalance(address: string): Promise<ChainBalance> {
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
export async function queryAcalaBalance(address: string) {
  return safeQuery(
    () => getAcalaBalance(address),
    'Failed to fetch Acala balance. The network might be experiencing issues.'
  );
}

/**
 * Get Acala chain configuration
 */
export function getAcalaConfig() {
  return config;
}

