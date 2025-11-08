/**
 * AI Portfolio Advisor using Groq
 * 
 * Provides intelligent insights about user's cross-chain portfolio
 */

'use server';

interface PortfolioData {
  totalValue: number;
  chains: Array<{
    name: string;
    token: string;
    balance: string;
    value: number;
    percentage: number;
  }>;
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
            content: `Analyze this Polkadot portfolio:

Total Value: $${portfolioData.totalValue.toFixed(2)}

Holdings:
${portfolioData.chains.map(chain => 
  `- ${chain.name}: ${chain.balance} ${chain.token} ($${chain.value.toFixed(2)}) - ${chain.percentage.toFixed(1)}%`
).join('\n')}

Provide:
1. Risk Assessment (1-2 sentences)
2. Top 3 Recommendations (specific actions)
3. Potential Yield Opportunities`
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
            content: `You are a Polkadot ecosystem expert. Answer questions about the user's portfolio and Polkadot ecosystem.
            
            User's Portfolio Context:
            - Total Value: $${portfolioContext.totalValue.toFixed(2)}
            - Holdings: ${portfolioContext.chains.map(c => `${c.name}: ${c.balance} ${c.token}`).join(', ')}
            
            Provide specific, actionable answers. Mention real protocols, APYs, and opportunities in Polkadot ecosystem.`
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

