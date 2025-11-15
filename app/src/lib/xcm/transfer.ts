/**
 * XCM Transfer Service
 * 
 * Handles cross-chain asset transfers via XCM
 * 
 * IMPORTANT: This is a DEMO implementation for the hackathon.
 * Production would use actual XCM pallets and proper transaction signing.
 * For testnet demo, this provides UI/UX showcase of XCM capabilities.
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  ChainId,
  XCMRoute,
  XCMTransferParams,
  XCMTransferResult,
  XCM_ROUTES,
  CHAIN_METADATA
} from '@/types/xcm';

/**
 * Get available XCM routes from a specific chain
 */
export function getAvailableRoutes(fromChain: ChainId): XCMRoute[] {
  return XCM_ROUTES.filter(route => route.from === fromChain && route.available);
}

/**
 * Get a specific XCM route
 */
export function getRoute(fromChain: ChainId, toChain: ChainId): XCMRoute | null {
  return XCM_ROUTES.find(
    route => route.from === fromChain && route.to === toChain && route.available
  ) || null;
}

/**
 * Calculate XCM transfer fee
 */
export function calculateXCMFee(route: XCMRoute, amount: number): number {
  // Base fee from route
  let fee = route.estimatedFee;
  
  // Add small percentage fee (0.1% of transfer)
  fee += amount * 0.001;
  
  return Number(fee.toFixed(4));
}

/**
 * Validate XCM transfer parameters
 */
export function validateXCMTransfer(
  params: XCMTransferParams,
  availableBalance: number
): { valid: boolean; error?: string } {
  const { fromChain, toChain, amount } = params;
  
  // Check if route exists
  const route = getRoute(fromChain, toChain);
  if (!route) {
    return {
      valid: false,
      error: `No XCM route available from ${fromChain} to ${toChain}`
    };
  }
  
  // Validate amount
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return {
      valid: false,
      error: 'Invalid amount'
    };
  }
  
  // Check minimum transfer (0.1 tokens)
  if (amountNum < 0.1) {
    return {
      valid: false,
      error: 'Minimum transfer amount is 0.1 tokens'
    };
  }
  
  // Check if user has enough balance
  const fee = calculateXCMFee(route, amountNum);
  const totalNeeded = amountNum + fee;
  
  if (totalNeeded > availableBalance) {
    return {
      valid: false,
      error: `Insufficient balance. Need ${totalNeeded.toFixed(4)} (including ${fee.toFixed(4)} fee)`
    };
  }
  
  return { valid: true };
}

/**
 * Execute XCM transfer
 * 
 * DEMO MODE: For hackathon demonstration, this simulates the transfer.
 * Production implementation would:
 * 1. Connect to source chain
 * 2. Build XCM message using limitedReserveTransferAssets or limitedTeleportAssets
 * 3. Sign and submit transaction
 * 4. Monitor cross-chain message delivery
 */
export async function executeXCMTransfer(
  params: XCMTransferParams
): Promise<XCMTransferResult> {
  try {
    const { fromChain, toChain, amount } = params;
    
    console.log('🚀 Initiating XCM transfer:', params);
    
    const route = getRoute(fromChain, toChain);
    if (!route) {
      return {
        success: false,
        error: 'Route not available'
      };
    }
    
    // DEMO: Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // DEMO: Generate mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;
    
    console.log('✅ XCM transfer simulated:', mockTxHash);
    
    return {
      success: true,
      txHash: mockTxHash,
      explorerUrl: `https://polkadot.subscan.io/extrinsic/${mockTxHash}`
    };
    
    /* PRODUCTION CODE (commented for demo):
    
    // Connect to source chain
    const provider = new WsProvider(CHAIN_METADATA[fromChain].rpc);
    const api = await ApiPromise.create({ provider });
    
    // Build XCM message
    const dest = {
      V3: {
        parents: 1,
        interior: {
          X1: { Parachain: getParachainId(toChain) }
        }
      }
    };
    
    const beneficiary = {
      V3: {
        parents: 0,
        interior: {
          X1: {
            AccountId32: {
              id: params.recipient,
              network: null
            }
          }
        }
      }
    };
    
    const assets = {
      V3: [{
        id: {
          Concrete: {
            parents: 0,
            interior: 'Here'
          }
        },
        fun: {
          Fungible: parseUnits(amount, decimals)
        }
      }]
    };
    
    // Execute transfer
    const tx = api.tx.xcmPallet.limitedReserveTransferAssets(
      dest,
      beneficiary,
      assets,
      0, // fee_asset_item
      'Unlimited' // weight_limit
    );
    
    // Sign and send
    const injector = await web3FromAddress(params.sender);
    const hash = await tx.signAndSend(params.sender, { signer: injector.signer });
    
    await api.disconnect();
    
    return {
      success: true,
      txHash: hash.toString(),
      explorerUrl: getExplorerUrl(fromChain, hash.toString())
    };
    */
    
  } catch (error) {
    console.error('XCM transfer error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transfer failed'
    };
  }
}

/**
 * Get XCM transfer suggestions based on portfolio
 */
export interface XCMSuggestion {
  route: XCMRoute;
  reason: string;
  potentialBenefit: string;
  priority: 'high' | 'medium' | 'low';
}

export function getXCMSuggestions(
  balances: Record<ChainId, number>
): XCMSuggestion[] {
  const suggestions: XCMSuggestion[] = [];
  
  // Suggest moving DOT to Asset Hub for staking
  if (balances.polkadot > 10 && balances.acala < 1) {
    const route = getRoute('polkadot', 'acala');
    if (route) {
      suggestions.push({
        route,
        reason: 'Your DOT is idle on Polkadot Relay Chain',
        potentialBenefit: 'Transfer to Asset Hub for 15% staking APY',
        priority: 'high'
      });
    }
  }
  
  // Suggest consolidating small balances
  if (balances.astar > 0 && balances.astar < 5) {
    const route = getRoute('astar', 'polkadot');
    if (route) {
      suggestions.push({
        route,
        reason: 'Small ASTR balance detected',
        potentialBenefit: 'Consolidate to Polkadot for better liquidity',
        priority: 'low'
      });
    }
  }
  
  // Suggest diversifying if all funds on one chain
  const totalBalance = Object.values(balances).reduce((a, b) => a + b, 0);
  const dotBalance = balances.polkadot || 0;
  
  if (dotBalance > totalBalance * 0.9 && dotBalance > 50) {
    const route = getRoute('polkadot', 'astar');
    if (route) {
      suggestions.push({
        route,
        reason: 'Over 90% of portfolio is on Polkadot',
        potentialBenefit: 'Diversify to Astar for DeFi opportunities',
        priority: 'medium'
      });
    }
  }
  
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

