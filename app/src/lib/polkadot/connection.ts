/**
 * Polkadot.js Extension Connection
 * 
 * This module handles connection to the Polkadot.js browser extension.
 * 
 * BLOCKCHAIN CONCEPT: Web3 Wallets
 * ================================
 * In Web3, wallets are browser extensions that:
 * 1. Store private keys securely
 * 2. Manage multiple accounts
 * 3. Sign transactions
 * 4. Connect to dApps (like our app)
 * 
 * The extension never shares private keys with dApps.
 * It only shares public addresses and signs transactions
 * when the user approves.
 * 
 * Learn more: https://wiki.polkadot.network/docs/learn-account-generation
 */

const APP_NAME = 'ChainLink Portfolio';

/**
 * Dynamically import Polkadot extension functions (client-side only)
 * This prevents SSR issues with Next.js
 */
async function getExtensionApi() {
  if (typeof window === 'undefined') {
    throw new Error('Extension API only available in browser');
  }
  
  const { web3Enable, web3Accounts, web3FromAddress } = await import('@polkadot/extension-dapp');
  return { web3Enable, web3Accounts, web3FromAddress };
}

/**
 * Check if Polkadot.js extension is installed
 * 
 * This checks if the browser has the extension injected.
 * Must be called from browser environment (not SSR).
 */
export function isExtensionAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if injectedWeb3 exists and has polkadot-js
  return !!(window as any).injectedWeb3?.['polkadot-js'];
}

/**
 * Connect to Polkadot.js extension and fetch accounts
 * 
 * This function:
 * 1. Requests access to the extension (user must approve)
 * 2. Fetches all available accounts
 * 3. Returns accounts or throws error
 * 
 * IMPORTANT: User must approve connection in extension popup!
 * 
 * @returns Array of account objects with address, name, and source
 * @throws Error if extension not found or no accounts
 */
export async function connectWallet() {
  // Get extension API (client-side only)
  const { web3Enable, web3Accounts } = await getExtensionApi();
  
  // Request access to extension
  // This shows a popup to the user asking for permission
  const extensions = await web3Enable(APP_NAME);
  
  if (extensions.length === 0) {
    throw new Error(
      'Polkadot.js extension not found. Please install it from polkadot.js.org/extension/'
    );
  }

  // Fetch all accounts from the extension
  // This includes accounts from all supported wallet extensions
  const accounts = await web3Accounts();
  
  if (accounts.length === 0) {
    throw new Error(
      'No accounts found. Please create an account in your Polkadot.js extension.'
    );
  }

  // Map to our Account interface
  return accounts.map((account) => ({
    address: account.address,
    name: account.meta.name,
    source: account.meta.source
  }));
}

/**
 * Get signer for an account
 * 
 * The signer is needed to sign transactions (not used in MVP read-only version).
 * Keeping this for future functionality.
 * 
 * @param address - Account address to get signer for
 * @returns Injector with signer object
 */
export async function getSigner(address: string) {
  const { web3FromAddress } = await getExtensionApi();
  const injector = await web3FromAddress(address);
  return injector.signer;
}

/**
 * Format account name for display
 * 
 * If account has a name, use it. Otherwise show shortened address.
 * 
 * @param address - Account address
 * @param name - Optional account name
 * @returns Formatted display name
 */
export function formatAccountName(address: string, name?: string): string {
  if (name) return name;
  
  // Show first 6 and last 4 characters of address
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}


