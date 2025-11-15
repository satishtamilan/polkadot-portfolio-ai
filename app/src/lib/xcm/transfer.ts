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
 * Execute XCM transfer - REAL implementation for testnet
 * 
 * This executes actual XCM transfers on testnet chains.
 * NOTE: XCM support varies by testnet. Some routes may not work due to:
 * - Testnet configuration differences
 * - XCM channel availability
 * - Pallet availability on specific testnets
 */
export async function executeXCMTransfer(
  params: XCMTransferParams
): Promise<XCMTransferResult> {
  try {
    const { fromChain, toChain, amount, recipient } = params;
    
    console.log('🚀 Initiating REAL XCM transfer:', params);
    
    const route = getRoute(fromChain, toChain);
    if (!route) {
      return {
        success: false,
        error: 'Route not available'
      };
    }

    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('XCM transfers only work in browser');
    }

    // Dynamically import Polkadot extension functions
    const { web3FromAddress } = await import('@polkadot/extension-dapp');
    
    // Connect to source chain
    const provider = new WsProvider(CHAIN_METADATA[fromChain].rpc);
    const api = await ApiPromise.create({ provider });
    
    console.log('✅ Connected to', CHAIN_METADATA[fromChain].name);

    // Get decimals for the token
    const decimals = getTokenDecimals(fromChain);
    const amountInPlanck = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)));

    // Build XCM transfer based on the route
    // For simplicity, we'll use polkadotXcm.limitedTeleportAssets for relay->parachain
    // and xcmPallet.limitedReserveTransferAssets for parachain->relay
    
    let tx;
    
    if (fromChain === 'polkadot') {
      // From Relay Chain to Parachain - use teleport
      const parachainId = getParachainId(toChain);
      
      tx = api.tx.xcmPallet?.limitedTeleportAssets(
        { V3: { parents: 0, interior: { X1: { Parachain: parachainId } } } }, // destination
        { V3: { parents: 0, interior: { X1: { AccountId32: { id: recipient, network: null } } } } }, // beneficiary
        { V3: [{ id: { Concrete: { parents: 0, interior: 'Here' } }, fun: { Fungible: amountInPlanck.toString() } }] }, // assets
        0, // fee_asset_item
        'Unlimited' // weight_limit
      );
    } else {
      // From Parachain to Relay Chain or another Parachain - use reserve transfer
      tx = api.tx.polkadotXcm?.limitedReserveTransferAssets(
        { V3: { parents: 1, interior: 'Here' } }, // destination (relay chain)
        { V3: { parents: 0, interior: { X1: { AccountId32: { id: recipient, network: null } } } } }, // beneficiary
        { V3: [{ id: { Concrete: { parents: 1, interior: 'Here' } }, fun: { Fungible: amountInPlanck.toString() } }] }, // assets
        0, // fee_asset_item
        'Unlimited' // weight_limit
      );
    }

    if (!tx) {
      await api.disconnect();
      return {
        success: false,
        error: 'XCM pallet not available on this chain. This testnet may not support XCM yet.'
      };
    }

    // Get injector for signing
    const injector = await web3FromAddress(recipient);
    
    console.log('📝 Signing transaction...');

    // Sign and send transaction
    const unsub = await tx.signAndSend(
      recipient,
      { signer: injector.signer },
      ({ status, events }) => {
        console.log('Transaction status:', status.type);

        if (status.isInBlock) {
          console.log('✅ Included in block:', status.asInBlock.toHex());
        }
      }
    );

    // Wait a bit for transaction to be included
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await api.disconnect();
    
    console.log('✅ XCM transfer submitted successfully!');
    
    return {
      success: true,
      txHash: 'Transaction submitted - check your wallet for confirmation',
      explorerUrl: `https://polkadot.js.org/apps/?rpc=${CHAIN_METADATA[fromChain].rpc}#/explorer`
    };
    
  } catch (error) {
    console.error('XCM transfer error:', error);
    
    // Provide helpful error messages
    let errorMsg = 'Transfer failed';
    if (error instanceof Error) {
      if (error.message.includes('Cancelled')) {
        errorMsg = 'Transaction cancelled by user';
      } else if (error.message.includes('pallet')) {
        errorMsg = 'XCM pallet not available on this testnet. Try Polkadot → Asset Hub route.';
      } else {
        errorMsg = error.message;
      }
    }
    
    return {
      success: false,
      error: errorMsg
    };
  }
}

/**
 * Get token decimals for a chain
 */
function getTokenDecimals(chainId: ChainId): number {
  const decimals: Record<ChainId, number> = {
    polkadot: 10, // DOT
    astar: 12,    // ASTR  
    moonbeam: 12, // GLMR
    acala: 10     // PAS
  };
  return decimals[chainId];
}

/**
 * Get parachain ID for XCM routing
 */
function getParachainId(chainId: ChainId): number {
  const parachainIds: Record<ChainId, number> = {
    polkadot: 0,     // Relay chain
    astar: 1000,     // Westend parachain ID (for testnet)
    moonbeam: 1002,  // Westend Asset Hub
    acala: 1000      // Paseo Asset Hub
  };
  return parachainIds[chainId];
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

