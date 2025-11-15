/**
 * Portfolio Health Score Calculator
 * 
 * Calculates a 0-100 health score based on:
 * - Diversification (30 points)
 * - Portfolio size (20 points)
 * - Risk balance (25 points)
 * - Activity/staking potential (25 points)
 */

import { AggregatedPortfolio } from '@/types/portfolio';

export interface HealthScoreBreakdown {
  total: number; // 0-100
  diversification: number; // 0-30
  size: number; // 0-20
  riskBalance: number; // 0-25
  activity: number; // 0-25
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  recommendations: string[];
}

/**
 * Calculate portfolio health score
 */
export function calculateHealthScore(
  portfolio: AggregatedPortfolio
): HealthScoreBreakdown {
  const diversification = calculateDiversificationScore(portfolio);
  const size = calculateSizeScore(portfolio);
  const riskBalance = calculateRiskBalanceScore(portfolio);
  const activity = calculateActivityScore(portfolio);

  const total = diversification + size + riskBalance + activity;
  const grade = getGrade(total);
  const recommendations = generateRecommendations(portfolio, {
    diversification,
    size,
    riskBalance,
    activity
  });

  return {
    total: Math.round(total),
    diversification: Math.round(diversification),
    size: Math.round(size),
    riskBalance: Math.round(riskBalance),
    activity: Math.round(activity),
    grade,
    recommendations
  };
}

/**
 * Diversification Score (0-30 points)
 * - 1 chain: 5 points
 * - 2 chains: 15 points
 * - 3 chains: 25 points
 * - 4+ chains: 30 points
 * - Bonus for balanced distribution
 */
function calculateDiversificationScore(portfolio: AggregatedPortfolio): number {
  const activeChains = portfolio.chains.filter(c => c.totalValue > 0).length;
  
  // Base score by number of chains
  let score = 0;
  if (activeChains === 1) score = 5;
  else if (activeChains === 2) score = 15;
  else if (activeChains === 3) score = 25;
  else if (activeChains >= 4) score = 30;

  // Bonus for balanced distribution (no single chain > 70%)
  const maxPercentage = Math.max(...portfolio.chains.map(c => c.percentage));
  if (maxPercentage < 70 && activeChains >= 2) {
    score = Math.min(30, score + 5); // +5 bonus for balance
  }

  return score;
}

/**
 * Portfolio Size Score (0-20 points)
 * Logarithmic scale:
 * - $0-100: 2 points
 * - $100-500: 5 points
 * - $500-1K: 8 points
 * - $1K-5K: 12 points
 * - $5K-10K: 15 points
 * - $10K+: 20 points
 */
function calculateSizeScore(portfolio: AggregatedPortfolio): number {
  const value = portfolio.totalValue;
  
  if (value < 100) return 2;
  if (value < 500) return 5;
  if (value < 1000) return 8;
  if (value < 5000) return 12;
  if (value < 10000) return 15;
  return 20;
}

/**
 * Risk Balance Score (0-25 points)
 * - Mix of Layer 0 (DOT) and Layer 1 parachains
 * - Presence of stablecoins would be +5 (not implemented yet)
 * - Avoid over-concentration in high-risk assets
 */
function calculateRiskBalanceScore(portfolio: AggregatedPortfolio): number {
  let score = 0;

  // Check for DOT (Layer 0) - 10 points
  const hasDOT = portfolio.chains.some(
    c => c.token === 'DOT' && c.totalValue > 0
  );
  if (hasDOT) score += 10;

  // Check for parachains (Layer 1) - 10 points
  const hasParachains = portfolio.chains.some(
    c => ['ASTR', 'GLMR', 'PAS'].includes(c.token) && c.totalValue > 0
  );
  if (hasParachains) score += 10;

  // Bonus if both DOT and parachains - 5 points
  if (hasDOT && hasParachains) score += 5;

  return score;
}

/**
 * Activity Score (0-25 points)
 * Based on whether assets could be generating yield:
 * - Tokens sitting idle: Low score
 * - Potential for staking: Higher score
 * - Multiple chains active: Bonus
 */
function calculateActivityScore(portfolio: AggregatedPortfolio): number {
  let score = 0;

  const activeChains = portfolio.chains.filter(c => c.totalValue > 0).length;

  // Base score for having any assets: 10 points
  if (activeChains > 0) score += 10;

  // Bonus for having stakeable tokens (DOT, ASTR, GLMR)
  const stakeableTokens = ['DOT', 'ASTR', 'GLMR'];
  const hasStakeable = portfolio.chains.some(
    c => stakeableTokens.includes(c.token) && c.totalValue > 10 // > $10 worth
  );
  if (hasStakeable) score += 10;

  // Bonus for multi-chain activity: 5 points
  if (activeChains >= 3) score += 5;

  return score;
}

/**
 * Get letter grade from score
 */
function getGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'S'; // Exceptional
  if (score >= 80) return 'A'; // Excellent
  if (score >= 70) return 'B'; // Good
  if (score >= 60) return 'C'; // Fair
  if (score >= 50) return 'D'; // Poor
  return 'F'; // Needs improvement
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(
  portfolio: AggregatedPortfolio,
  scores: {
    diversification: number;
    size: number;
    riskBalance: number;
    activity: number;
  }
): string[] {
  const recommendations: string[] = [];

  // Diversification recommendations
  if (scores.diversification < 15) {
    recommendations.push(
      '🌐 Diversify across more chains to reduce risk'
    );
  }

  const activeChains = portfolio.chains.filter(c => c.totalValue > 0).length;
  const maxPercentage = Math.max(...portfolio.chains.map(c => c.percentage));
  
  if (maxPercentage > 70 && activeChains >= 2) {
    recommendations.push(
      '⚖️ Rebalance portfolio - one chain holds >70% of assets'
    );
  }

  // Risk balance recommendations
  if (scores.riskBalance < 15) {
    const hasDOT = portfolio.chains.some(c => c.token === 'DOT' && c.totalValue > 0);
    if (!hasDOT) {
      recommendations.push(
        '🛡️ Add DOT for stability - it\'s the Layer 0 backbone'
      );
    }
  }

  // Activity recommendations
  if (scores.activity < 15) {
    const stakeableTokens = ['DOT', 'ASTR', 'GLMR'];
    const hasStakeable = portfolio.chains.some(
      c => stakeableTokens.includes(c.token) && c.totalValue > 10
    );
    if (hasStakeable) {
      recommendations.push(
        '💰 Consider staking your tokens to earn passive income (12-15% APY)'
      );
    }
  }

  // Size recommendations
  if (scores.size < 10) {
    recommendations.push(
      '📈 Increase portfolio size to unlock more DeFi opportunities'
    );
  }

  // If perfect score
  if (recommendations.length === 0) {
    recommendations.push(
      '🎉 Excellent portfolio health! Consider exploring advanced DeFi strategies'
    );
  }

  return recommendations.slice(0, 3); // Max 3 recommendations
}

/**
 * Get color for health score
 */
export function getHealthColor(score: number): string {
  if (score >= 80) return '#10b981'; // Green
  if (score >= 70) return '#3b82f6'; // Blue
  if (score >= 60) return '#f59e0b'; // Orange
  if (score >= 50) return '#f97316'; // Dark orange
  return '#ef4444'; // Red
}

/**
 * Get health status text
 */
export function getHealthStatus(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Needs Attention';
  return 'Critical';
}

