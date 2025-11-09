/**
 * AI Portfolio Advisor using Groq
 * 
 * Provides intelligent insights about user's cross-chain portfolio
 */

'use server';

interface PortfolioData {
  totalValue: number;
  change24h?: number;
  activeChains?: number;
  chains: Array<{
    name: string;
    token: string;
    balance: number; // Formatted balance (not raw string)
    value: number;
    percentage: number;
    change24h?: number;
  }>;
  timestamp?: string;
}

export async function getPortfolioInsights(portfolioData: PortfolioData) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are an expert Polkadot ecosystem portfolio advisor. Analyze portfolios and provide:
            - Risk assessment (concentration risk, diversification)
            - Specific recommendations for Polkadot ecosystem
            - Staking opportunities (Polkadot nomination pools 15% APY, Astar dApp staking 12% APY)
            - Cross-chain strategies using XCM
            - DeFi opportunities on Moonbeam (BeamSwap, StellaSwap)
            
            Keep responses concise, actionable, and specific to the Polkadot ecosystem.
            Use emojis sparingly for emphasis.`
          },
          {
            role: 'user',
            content: `Analyze this Polkadot ecosystem portfolio:

**CURRENT HOLDINGS:**
${portfolioData.chains.map(chain => 
  `• ${chain.name}: ${chain.balance.toFixed(2)} ${chain.token} = $${chain.value.toFixed(2)} USD (${chain.percentage.toFixed(1)}% of portfolio)`
).join('\n')}

**TOTAL PORTFOLIO VALUE:** $${portfolioData.totalValue.toFixed(2)} USD
**NUMBER OF CHAINS:** ${portfolioData.chains.length}
**DIVERSIFICATION:** ${portfolioData.chains.length >= 3 ? 'Multi-chain' : 'Needs diversification'}

IMPORTANT: The user ALREADY OWNS these tokens. Do NOT recommend buying tokens they already have. Instead:
- Suggest optimal allocation percentages
- Recommend staking strategies for existing holdings
- Identify any gaps in ecosystem coverage
- Suggest cross-chain yield strategies

Provide:
1. **Risk Assessment:** Analyze current allocation (1-2 sentences)
2. **Top 3 Recommendations:** Specific actions based on CURRENT holdings
3. **Yield Opportunities:** Staking/DeFi for tokens they ALREADY own`
          }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      insights: data.choices[0]?.message?.content || 'Unable to generate insights'
    };
  } catch (error) {
    console.error('AI Insights Error:', error);
    return {
      success: false,
      error: 'Failed to generate AI insights. Please try again.'
    };
  }
}

export async function askAIQuestion(question: string, portfolioContext: PortfolioData) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a Polkadot ecosystem expert advisor. 
            
**USER'S CURRENT PORTFOLIO:**
${portfolioContext.chains.map(c => `• ${c.name}: ${c.balance.toFixed(2)} ${c.token} ($${c.value.toFixed(2)} USD)`).join('\n')}
**Total Value:** $${portfolioContext.totalValue.toFixed(2)} USD

IMPORTANT: These are tokens the user ALREADY OWNS. Base your advice on their CURRENT holdings.
            
Provide specific, actionable answers about:
- Staking opportunities for tokens they OWN
- Yield farming on chains they're ALREADY on
- Cross-chain strategies using XCM
- Real protocols: Polkadot Nomination Pools (15% APY), Astar dApp Staking (12% APY), Moonbeam DEXs (BeamSwap, StellaSwap)

Keep responses concise and practical.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      answer: data.choices[0]?.message?.content || 'Unable to answer question'
    };
  } catch (error) {
    console.error('AI Question Error:', error);
    return {
      success: false,
      error: 'Failed to get answer. Please try again.'
    };
  }
}

