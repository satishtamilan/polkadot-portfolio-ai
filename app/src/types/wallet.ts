/**
 * Wallet-related TypeScript types
 * 
 * BLOCKCHAIN CONCEPT: Wallet Accounts
 * ===================================
 * In Web3, a wallet can contain multiple accounts. Each account has:
 * - address: Public key (like a bank account number) - safe to share
 * - name: User-friendly label
 * - source: Which wallet extension created it (polkadot-js, SubWallet, etc.)
 * 
 * Private keys are NEVER shared - they stay secure in the wallet extension.
 * 
 * Learn more: https://wiki.polkadot.network/docs/learn-accounts
 */

/**
 * Represents a single wallet account
 */
export interface Account {
  /** 
   * The public address (SS58 format for Polkadot)
   * Example: "1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg"
   */
  address: string;
  
  /**
   * Human-readable name for the account
   * Example: "Alice", "My Savings", etc.
   */
  name?: string;
  
  /**
   * Which wallet extension this account comes from
   * Example: "polkadot-js", "subwallet", "talisman"
   */
  source: string;
}

/**
 * The complete wallet state for the application
 */
export interface WalletState {
  /**
   * All available accounts from the wallet extension
   */
  accounts: Account[];
  
  /**
   * The currently selected/active account
   */
  selectedAccount: Account | null;
  
  /**
   * Whether a wallet is currently connected
   */
  isConnected: boolean;
  
  /**
   * Whether a connection attempt is in progress
   */
  isConnecting: boolean;
  
  /**
   * Any error that occurred during connection
   */
  error: string | null;
}

/**
 * Functions available from the Wallet Context
 */
export interface WalletContextType extends WalletState {
  /**
   * Attempt to connect to the Polkadot.js extension
   */
  connect: () => Promise<void>;
  
  /**
   * Disconnect the current wallet
   */
  disconnect: () => void;
  
  /**
   * Select a different account from the available accounts
   */
  selectAccount: (account: Account) => void;
}

