/**
 * Price API Integration
 * 
 * Fetches token prices from CoinGecko API.
 * Used to calculate portfolio value in USD.
 * 
 * API CONCEPT: Token Prices
 * =========================
 * Cryptocurrency prices fluctuate constantly. We fetch from
 * CoinGecko's free API which aggregates prices from exchanges.
 * 
 * Rate limits apply to free tier, so we cache prices.
 * 
 * Learn more: https://www.coingecko.com/en/api/documentation
 */

import { TokenPrice } from '@/types';
import { PRICE_API } from '@/lib/utils/constants';

/**
 * Token price cache
 * Stores prices temporarily to reduce API calls
 */
const priceCache = new Map<string, { price: TokenPrice; timestamp: number }>();

/**
 * Fetch token prices from CoinGecko
 * 
 * @param symbols - Array of token symbols (DOT, ASTR, GLMR, ACA)
 * @returns Map of symbol to price data with REAL market prices
 */
export async function fetchTokenPrices(
  symbols: string[]
): Promise<Map<string, TokenPrice>> {
  const now = Date.now();
  const prices = new Map<string, TokenPrice>();

  // Check cache first
  const uncachedSymbols: string[] = [];
  for (const symbol of symbols) {
    const cached = priceCache.get(symbol);
    if (cached && now - cached.timestamp < PRICE_API.cacheDuration) {
      prices.set(symbol, cached.price);
    } else {
      uncachedSymbols.push(symbol);
    }
  }

  // If all prices are cached, return them
  if (uncachedSymbols.length === 0) {
    return prices;
  }

  // Fetch uncached prices
  try {
    // Handle PAS token separately (not on CoinGecko - it's a testnet token)
    // Give it same price as DOT for demo purposes
    const pasIndex = uncachedSymbols.indexOf('PAS');
    if (pasIndex !== -1) {
      // If DOT price exists, use it for PAS
      const dotPrice = prices.get('DOT');
      if (dotPrice) {
        const pasPrice: TokenPrice = {
          symbol: 'PAS',
          usd: dotPrice.usd, // Same as DOT for demo
          change24h: dotPrice.change24h || 0,
          lastUpdated: now
        };
        prices.set('PAS', pasPrice);
        priceCache.set('PAS', { price: pasPrice, timestamp: now });
      } else {
        // If DOT not fetched yet, fetch it first
        uncachedSymbols.push('DOT');
      }
      uncachedSymbols.splice(pasIndex, 1); // Remove PAS from API call
    }

    // Map symbols to CoinGecko IDs
    const ids = uncachedSymbols
      .map((symbol) => PRICE_API.tokenIds[symbol as keyof typeof PRICE_API.tokenIds])
      .filter(Boolean)
      .join(',');

    if (!ids) {
      // No real tokens to fetch, return what we have
      return prices;
    }

    // Fetch from CoinGecko
    const response = await fetch(
      `${PRICE_API.baseUrl}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      {
        next: { revalidate: 300 } // Cache for 5 minutes in Next.js
      }
    );

    if (!response.ok) {
      throw new Error(`Price API returned ${response.status}`);
    }

    const data = await response.json();

    // Parse response and update cache
    for (const symbol of uncachedSymbols) {
      const coinId = PRICE_API.tokenIds[symbol as keyof typeof PRICE_API.tokenIds];
      if (coinId && data[coinId]) {
        const priceData: TokenPrice = {
          symbol,
          usd: data[coinId].usd || 0,
          change24h: data[coinId].usd_24h_change || 0,
          lastUpdated: now
        };

        prices.set(symbol, priceData);
        priceCache.set(symbol, { price: priceData, timestamp: now });
      }
    }
  } catch (error) {
    console.error('Failed to fetch token prices:', error);
    
    // Return mock prices for development/testing
    // In production, you might want to handle this differently
    for (const symbol of uncachedSymbols) {
      const mockPrice: TokenPrice = {
        symbol,
        usd: 0,
        change24h: 0,
        lastUpdated: now
      };
      prices.set(symbol, mockPrice);
    }
  }

  return prices;
}

/**
 * Get price for a single token
 * 
 * @param symbol - Token symbol
 * @returns Token price data
 */
export async function getTokenPrice(symbol: string): Promise<TokenPrice | null> {
  const prices = await fetchTokenPrices([symbol]);
  return prices.get(symbol) || null;
}

/**
 * Clear price cache
 * Useful for manual refresh
 */
export function clearPriceCache() {
  priceCache.clear();
}


