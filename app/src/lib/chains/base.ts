/**
 * Base Chain Interface
 * 
 * Common interface that all chain integrations implement.
 * Provides consistent API across different parachains.
 */

import { ChainBalance, ChainId } from '@/types';

export interface ChainQuery {
  /**
   * Query account balance on the chain
   */
  getBalance(address: string): Promise<ChainBalance>;
  
  /**
   * Get chain configuration
   */
  getConfig(): {
    id: ChainId;
    name: string;
    token: string;
    decimals: number;
    rpc: string;
    fallbackRpc?: string;
    explorer: string;
    color: string;
  };
}

/**
 * Query result type for handling success/failure
 */
export type QueryResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; userMessage: string };

/**
 * Wrapper for safe chain queries
 * 
 * Handles errors gracefully and returns consistent result type
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
  errorMessage: string
): Promise<QueryResult<T>> {
  try {
    const data = await queryFn();
    return { success: true, data };
  } catch (error) {
    console.error('Chain query error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      userMessage: errorMessage
    };
  }
}


