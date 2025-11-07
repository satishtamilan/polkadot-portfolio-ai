/**
 * AI Portfolio Advisor Component
 * 
 * Provides AI-powered insights about user's portfolio
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useMultiChain } from '@/contexts/MultiChainContext';
import { getPortfolioInsights, askAIQuestion } from '@/lib/ai/groq';
import { Brain, Sparkles, MessageSquare, TrendingUp } from 'lucide-react';

export function AIAdvisor() {
  const { portfolio } = useMultiChain();
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string }>>([]);

  const handleGetInsights = async () => {
    if (!portfolio || portfolio.totalValue === 0) {
      setError('Please connect your wallet to get portfolio insights');
      return;
    }

    setIsLoading(true);
    setError(null);

    const portfolioData = {
      totalValue: portfolio.totalValue,
      chains: portfolio.chains.map(chain => ({
        name: chain.chainName,
        token: chain.token,
        balance: chain.balance,
        value: chain.totalValue,
        percentage: chain.percentage
      }))
    };

    const result = await getPortfolioInsights(portfolioData);

    if (result.success) {
      setInsights(result.insights);
    } else {
      setError(result.error || 'Failed to get insights');
    }

    setIsLoading(false);
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !portfolio) return;

    setIsLoading(true);
    setError(null);

    const portfolioData = {
      totalValue: portfolio.totalValue,
      chains: portfolio.chains.map(chain => ({
        name: chain.chainName,
        token: chain.token,
        balance: chain.balance,
        value: chain.totalValue,
        percentage: chain.percentage
      }))
    };

    const result = await askAIQuestion(question, portfolioData);

    if (result.success) {
      setChatHistory([...chatHistory, { q: question, a: result.answer }]);
      setQuestion('');
    } else {
      setError(result.error || 'Failed to get answer');
    }

    setIsLoading(false);
  };

  const suggestedQuestions = [
    "Should I stake my tokens?",
    "How should I diversify?",
    "What are the best DeFi opportunities?",
    "How risky is my portfolio?"
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[var(--polkadot-pink)] to-[var(--astar-blue)]">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">AI Portfolio Advisor</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Powered by Groq AI • Polkadot Ecosystem Expert
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setChatMode(false)}
            variant={!chatMode ? 'primary' : 'secondary'}
            size="sm"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Insights
          </Button>
          <Button
            onClick={() => setChatMode(true)}
            variant={chatMode ? 'primary' : 'secondary'}
            size="sm"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat
          </Button>
        </div>
      </div>

      {/* Insights Mode */}
      {!chatMode && (
        <div>
          {!insights && !isLoading && (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-[var(--polkadot-pink)]" />
              <p className="text-[var(--text-secondary)] mb-4">
                Get AI-powered analysis of your cross-chain portfolio
              </p>
              <Button onClick={handleGetInsights} variant="primary">
                <Brain className="h-4 w-4 mr-2" />
                Analyze My Portfolio
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <Spinner size="lg" />
              <p className="mt-4 text-[var(--text-secondary)]">
                AI is analyzing your portfolio...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 p-4 text-[var(--error)]">
              {error}
            </div>
          )}

          {insights && !isLoading && (
            <div>
              <div className="rounded-lg bg-gradient-to-r from-[var(--polkadot-pink)]/5 to-[var(--astar-blue)]/5 border border-[var(--card-border)] p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-[var(--text-primary)]">
                    {insights}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleGetInsights} variant="secondary" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Refresh Insights
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Mode */}
      {chatMode && (
        <div>
          {/* Chat History */}
          <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
            {chatHistory.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-[var(--astar-blue)]" />
                <p className="text-[var(--text-secondary)] mb-4">
                  Ask me anything about your portfolio or Polkadot ecosystem
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setQuestion(q)}
                      className="text-sm px-3 py-1.5 rounded-full bg-[var(--card-background)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--polkadot-pink)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatHistory.map((chat, i) => (
              <div key={i} className="space-y-2">
                {/* Question */}
                <div className="flex justify-end">
                  <div className="bg-[var(--polkadot-pink)] text-white rounded-lg px-4 py-2 max-w-[80%]">
                    {chat.q}
                  </div>
                </div>
                {/* Answer */}
                <div className="flex justify-start">
                  <div className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg px-4 py-2 max-w-[80%]">
                    <div className="whitespace-pre-wrap text-[var(--text-primary)]">
                      {chat.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
              placeholder="Ask about staking, DeFi, or portfolio strategy..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-[var(--card-background)] border border-[var(--card-border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--polkadot-pink)]"
            />
            <Button
              onClick={handleAskQuestion}
              disabled={!question.trim() || isLoading}
              variant="primary"
            >
              {isLoading ? <Spinner size="sm" /> : <Sparkles className="h-4 w-4" />}
            </Button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 p-3 text-sm text-[var(--error)]">
              {error}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

