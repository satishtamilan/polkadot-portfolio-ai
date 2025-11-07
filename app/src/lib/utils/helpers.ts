/**
 * Helper utility functions
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes efficiently
 * 
 * This utility combines clsx (for conditional classes) with tailwind-merge
 * (to properly merge Tailwind classes without conflicts)
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4' (px-4 overrides px-2)
 * cn('text-red-500', condition && 'text-blue-500') // conditional class
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sleep for a specified duration (useful for testing/delays)
 * 
 * @example
 * await sleep(1000); // Wait 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely parse JSON with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Check if code is running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get from localStorage safely (SSR-safe)
 */
export function getLocalStorage(key: string, fallback: string = ''): string {
  if (!isBrowser()) return fallback;
  
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Set to localStorage safely (SSR-safe)
 */
export function setLocalStorage(key: string, value: string): boolean {
  if (!isBrowser()) return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove from localStorage safely (SSR-safe)
 */
export function removeLocalStorage(key: string): boolean {
  if (!isBrowser()) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Debounce a function call
 * 
 * @example
 * const debouncedSearch = debounce((query) => search(query), 300);
 * debouncedSearch('polkadot'); // Only calls after 300ms of no more calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function call (execute at most once per period)
 * 
 * @example
 * const throttledScroll = throttle(() => handleScroll(), 100);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Create a promise that rejects after a timeout
 * Useful for adding timeouts to other promises
 * 
 * @example
 * await Promise.race([
 *   fetchData(),
 *   withTimeout(5000, 'Request timed out')
 * ]);
 */
export function withTimeout(ms: number, message: string = 'Operation timed out'): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}

/**
 * Retry a promise-returning function with exponential backoff
 * 
 * @param fn - Function that returns a promise
 * @param maxAttempts - Maximum number of retry attempts
 * @param delayMs - Initial delay between retries (doubles each time)
 * 
 * @example
 * const data = await retry(() => fetchDataFromChain(), 3, 1000);
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxAttempts) {
        // Exponential backoff: 1s, 2s, 4s, etc.
        const waitTime = delayMs * Math.pow(2, attempt - 1);
        await sleep(waitTime);
      }
    }
  }
  
  throw lastError;
}

/**
 * Truncate a string to a maximum length with ellipsis
 * 
 * @example
 * truncate('This is a long string', 10) // 'This is a...'
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Check if a string is a valid Polkadot address (basic validation)
 * 
 * Polkadot addresses are base58 encoded and start with specific characters
 * depending on the network. This is a simplified check.
 */
export function isValidAddress(address: string): boolean {
  // Basic checks: length and starts with valid character
  if (!address || typeof address !== 'string') return false;
  if (address.length < 47 || address.length > 48) return false;
  
  // Polkadot addresses typically start with 1 for mainnet
  // Kusama starts with uppercase letters
  // This is simplified - real validation should decode base58
  return /^[1-9A-HJ-NP-Za-km-z]{47,48}$/.test(address);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser()) return false;
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
}

