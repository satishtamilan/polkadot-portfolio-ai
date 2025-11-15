/**
 * XCM (Cross-Consensus Message) Transfer Types
 * 
 * Types for cross-chain asset transfers in the Polkadot ecosystem
 */

export interface XCMRoute {
  from: ChainId;
  to: ChainId;
  token: string;
  available: boolean;
  estimatedFee: number; // In token units
  estimatedTime: string; // e.g., "~30 seconds"
  description: string;
}

export type ChainId = 'polkadot' | 'astar' | 'moonbeam' | 'acala';

export interface XCMTransferParams {
  fromChain: ChainId;
  toChain: ChainId;
  token: string;
  amount: string;
  recipient: string;
}

export interface XCMTransferResult {
  success: boolean;
  txHash?: string;
  error?: string;
  explorerUrl?: string;
}

export interface ChainMetadata {
  id: ChainId;
  name: string;
  token: string;
  rpc: string;
  icon: string;
  color: string;
}

/**
 * Supported XCM routes in the Polkadot ecosystem
 * 
 * NOTE: For hackathon demo, these are simplified routes.
 * Production would use actual XCM pallet calls.
 */
export const XCM_ROUTES: XCMRoute[] = [
  // Polkadot <-> Asset Hub (Paseo)
  {
    from: 'polkadot',
    to: 'acala', // Paseo Asset Hub
    token: 'DOT',
    available: true,
    estimatedFee: 0.01,
    estimatedTime: '~30 seconds',
    description: 'Transfer DOT to Paseo Asset Hub via XCM'
  },
  {
    from: 'acala', // Paseo Asset Hub
    to: 'polkadot',
    token: 'PAS',
    available: true,
    estimatedFee: 0.01,
    estimatedTime: '~30 seconds',
    description: 'Transfer PAS back to Polkadot Relay Chain'
  },
  
  // Polkadot <-> Astar (via Westend for testnet)
  {
    from: 'polkadot',
    to: 'astar',
    token: 'DOT',
    available: true,
    estimatedFee: 0.02,
    estimatedTime: '~45 seconds',
    description: 'Transfer DOT to Astar via XCM'
  },
  {
    from: 'astar',
    to: 'polkadot',
    token: 'ASTR',
    available: true,
    estimatedFee: 0.5,
    estimatedTime: '~45 seconds',
    description: 'Transfer ASTR to Polkadot via XCM'
  },
  
  // Polkadot <-> Moonbeam (via Westend Asset Hub for testnet)
  {
    from: 'polkadot',
    to: 'moonbeam',
    token: 'DOT',
    available: true,
    estimatedFee: 0.01,
    estimatedTime: '~40 seconds',
    description: 'Transfer DOT to Moonbeam via XCM'
  },
  {
    from: 'moonbeam',
    to: 'polkadot',
    token: 'GLMR',
    available: true,
    estimatedFee: 0.1,
    estimatedTime: '~40 seconds',
    description: 'Transfer GLMR to Polkadot via XCM'
  },
  
  // Asset Hub <-> Parachains
  {
    from: 'acala',
    to: 'astar',
    token: 'PAS',
    available: true,
    estimatedFee: 0.01,
    estimatedTime: '~60 seconds',
    description: 'Transfer PAS to Astar via XCM (through Relay Chain)'
  },
  {
    from: 'acala',
    to: 'moonbeam',
    token: 'PAS',
    available: true,
    estimatedFee: 0.01,
    estimatedTime: '~60 seconds',
    description: 'Transfer PAS to Moonbeam via XCM (through Relay Chain)'
  }
];

export const CHAIN_METADATA: Record<ChainId, ChainMetadata> = {
  polkadot: {
    id: 'polkadot',
    name: 'Polkadot',
    token: 'DOT',
    rpc: 'wss://paseo.rpc.amforc.com',
    icon: '🔴',
    color: '#E6007A'
  },
  astar: {
    id: 'astar',
    name: 'Astar',
    token: 'ASTR',
    rpc: 'wss://westend-rpc.polkadot.io',
    icon: '🌟',
    color: '#0084FF'
  },
  moonbeam: {
    id: 'moonbeam',
    name: 'Moonbeam',
    token: 'GLMR',
    rpc: 'wss://westend-asset-hub-rpc.polkadot.io',
    icon: '🌙',
    color: '#53CBC9'
  },
  acala: {
    id: 'acala',
    name: 'Paseo Asset Hub',
    token: 'PAS',
    rpc: 'wss://pas-rpc.stakeworld.io/assethub',
    icon: '🏦',
    color: '#E40C5B'
  }
};

