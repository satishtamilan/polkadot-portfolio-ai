/**
 * Formatting utilities for displaying blockchain data
 * 
 * BLOCKCHAIN CONCEPT: Token Decimals
 * ===================================
 * Blockchains store token amounts as large integers to avoid decimal math.
 * Example: 1.5 DOT is stored as "15000000000" (1.5 * 10^10)
 * 
 * We need to convert these for human-readable display.
 */

/**
 * Format a balance string with proper decimals for display
 * 
 * @param balance - Raw balance as string (e.g., "15000000000")
 * @param decimals - Number of decimal places (DOT=10, ASTR/GLMR/ACA=18)
 * @param precision - How many decimal places to show (default: 4)
 * @returns Formatted string (e.g., "1.5000")
 * 
 * @example
 * formatBalance("15000000000", 10, 4) // "1.5000"
 * formatBalance("1500000000000000000", 18, 2) // "1.50"
 */
export function formatBalance(
  balance: string | number,
  decimals: number = 10,
  precision: number = 4
): string {
  try {
    const num = Number(balance) / Math.pow(10, decimals);
    return num.toFixed(precision);
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0.0000';
  }
}

/**
 * Format a balance with its token symbol
 * 
 * @example
 * formatBalanceWithSymbol("15000000000", 10, "DOT") // "1.5000 DOT"
 */
export function formatBalanceWithSymbol(
  balance: string | number,
  decimals: number,
  symbol: string,
  precision: number = 4
): string {
  const formatted = formatBalance(balance, decimals, precision);
  return `${formatted} ${symbol}`;
}

/**
 * Shorten an address for display
 * 
 * Blockchain addresses are long (48+ characters). We show first and last few chars.
 * 
 * @param address - Full address
 * @param chars - Number of characters to show at start/end (default: 4)
 * @returns Shortened address
 * 
 * @example
 * shortenAddress("1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg", 6)
 * // "1FRMM8...V24fg"
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a number as USD currency
 * 
 * @example
 * formatUSD(1234.56) // "$1,234.56"
 * formatUSD(0.123) // "$0.12"
 */
export function formatUSD(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Format a large number with commas
 * 
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Format a percentage
 * 
 * @example
 * formatPercent(0.1234) // "12.34%"
 * formatPercent(-0.05) // "-5.00%"
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a timestamp as a relative time (e.g., "2 hours ago")
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Format a timestamp as a date string
 * 
 * @example
 * formatDate(1699564800000) // "Nov 10, 2024 at 12:00 AM"
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(timestamp));
}

/**
 * Format a number compactly (1.2K, 3.4M, etc.)
 * 
 * @example
 * formatCompact(1234) // "1.2K"
 * formatCompact(1234567) // "1.2M"
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}

