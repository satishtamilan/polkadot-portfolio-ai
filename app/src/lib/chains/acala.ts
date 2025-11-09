/**
 * Paseo Asset Hub Integration
 * 
 * BLOCKCHAIN CONCEPT: Asset Hub (System Parachain)
 * =================================================
 * Asset Hub is a system parachain that handles:
 * - Asset issuance and management
 * - NFT creation and transfers
 * - Teleporting assets between parachains
 * - Lower fees for asset operations
 * 
 * Key features:
 * - Create fungible tokens (PSP-22 equivalent)
 * - Mint and trade NFTs
 * - Bridge assets via XCM
 * - Same address format as relay chain
 * 
 * Learn more: https://wiki.polkadot.network/docs/learn-assets
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
 * Query PAS balance for an account on Asset Hub
 * 
 * Paseo uses 10 decimals (same as DOT)
 * 1 PAS = 10,000,000,000 (10^10)
 * 
 * Asset Hub is a system parachain, so it uses the same
 * address format as the relay chain (Paseo).
 * 
 * @param address - Paseo address
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
    'Failed to fetch Paseo Asset Hub balance. The network might be experiencing issues.'
  );
}

/**
 * Get Paseo Asset Hub chain configuration
 */
export function getAcalaConfig() {
  return config;
}

