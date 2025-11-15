/**
 * XCM Transfer Component
 * 
 * User interface for cross-chain asset transfers
 * Showcases Polkadot's XCM capabilities for hackathon demo
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useMultiChain } from '@/contexts/MultiChainContext';
import { useWallet } from '@/contexts/WalletContext';
import {
  getAvailableRoutes,
  getRoute,
  calculateXCMFee,
  validateXCMTransfer,
  executeXCMTransfer,
  getXCMSuggestions
} from '@/lib/xcm/transfer';
import { ChainId, CHAIN_METADATA, XCMRoute } from '@/types/xcm';
import { ArrowRight, Zap, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export function XCMTransfer() {
  const { portfolio } = useMultiChain();
  const { selectedAccount } = useWallet();
  
  const [fromChain, setFromChain] = useState<ChainId>('polkadot');
  const [toChain, setToChain] = useState<ChainId>('acala');
  const [amount, setAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ txHash: string; explorerUrl: string } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  if (!portfolio || !selectedAccount) {
    return null;
  }

  const availableRoutes = getAvailableRoutes(fromChain);
  const currentRoute = getRoute(fromChain, toChain);
  
  // Get balances
  const balances: Record<ChainId, number> = {
    polkadot: portfolio.chains.find(c => c.token === 'DOT')?.balance || 0,
    astar: portfolio.chains.find(c => c.token === 'ASTR')?.balance || 0,
    moonbeam: portfolio.chains.find(c => c.token === 'GLMR')?.balance || 0,
    acala: portfolio.chains.find(c => c.token === 'PAS')?.balance || 0
  };
  
  const fromBalance = balances[fromChain];
  const fromToken = CHAIN_METADATA[fromChain].token;
  
  // Get suggestions
  const suggestions = getXCMSuggestions(balances);

  const handleTransfer = async () => {
    if (!currentRoute) return;
    
    setError(null);
    setSuccess(null);
    
    // Validate
    const validation = validateXCMTransfer(
      {
        fromChain,
        toChain,
        token: fromToken,
        amount,
        recipient: selectedAccount.address
      },
      fromBalance
    );
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid transfer');
      return;
    }
    
    setIsTransferring(true);
    
    try {
      const result = await executeXCMTransfer({
        fromChain,
        toChain,
        token: fromToken,
        amount,
        recipient: selectedAccount.address
      });
      
      if (result.success) {
        setSuccess({
          txHash: result.txHash || '',
          explorerUrl: result.explorerUrl || ''
        });
        setAmount('');
      } else {
        setError(result.error || 'Transfer failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setIsTransferring(false);
    }
  };

  const handleApplySuggestion = (route: XCMRoute) => {
    setFromChain(route.from);
    setToChain(route.to);
    setShowSuggestions(false);
  };

  const estimatedFee = currentRoute && amount
    ? calculateXCMFee(currentRoute, parseFloat(amount) || 0)
    : 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--polkadot-pink)]" />
            XCM Cross-Chain Transfer
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Move assets between parachains instantly
          </p>
        </div>
      </div>

      {/* AI Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-[var(--polkadot-pink)]/10 to-[var(--astar-blue)]/10 border border-[var(--card-border)]">
          <div className="flex items-start gap-2 mb-2">
            <Zap className="w-4 h-4 text-[var(--polkadot-pink)] mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                AI Recommendation
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {suggestions[0].reason}
              </p>
              <p className="text-xs text-[var(--polkadot-pink)] mt-1">
                💡 {suggestions[0].potentialBenefit}
              </p>
              <button
                onClick={() => handleApplySuggestion(suggestions[0].route)}
                className="text-xs text-[var(--astar-blue)] hover:underline mt-2"
              >
                Apply suggestion →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Form */}
      <div className="space-y-4">
        {/* From Chain */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
            From Chain
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CHAIN_METADATA).map(([id, chain]) => (
              <button
                key={id}
                onClick={() => setFromChain(id as ChainId)}
                disabled={balances[id as ChainId] === 0}
                className={`
                  p-3 rounded-lg border transition-all
                  ${fromChain === id
                    ? 'border-[var(--polkadot-pink)] bg-[var(--polkadot-pink)]/10'
                    : 'border-[var(--card-border)] hover:border-[var(--polkadot-pink)]/50'
                  }
                  ${balances[id as ChainId] === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{chain.icon}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium text-[var(--text-primary)]">
                      {chain.name}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {balances[id as ChainId].toFixed(2)} {chain.token}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-[var(--card-background)] border border-[var(--card-border)] flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-[var(--polkadot-pink)]" />
          </div>
        </div>

        {/* To Chain */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
            To Chain
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableRoutes.map((route) => {
              const chain = CHAIN_METADATA[route.to];
              return (
                <button
                  key={route.to}
                  onClick={() => setToChain(route.to)}
                  className={`
                    p-3 rounded-lg border transition-all
                    ${toChain === route.to
                      ? 'border-[var(--astar-blue)] bg-[var(--astar-blue)]/10'
                      : 'border-[var(--card-border)] hover:border-[var(--astar-blue)]/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{chain.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium text-[var(--text-primary)]">
                        {chain.name}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {route.estimatedTime}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.1"
              max={fromBalance}
              disabled={isTransferring}
              className="w-full px-4 py-3 rounded-lg bg-[var(--card-background)] border border-[var(--card-border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--polkadot-pink)]"
            />
            <button
              onClick={() => setAmount(fromBalance.toString())}
              disabled={isTransferring}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--polkadot-pink)] hover:underline"
            >
              MAX
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-[var(--text-secondary)]">
            <span>Available: {fromBalance.toFixed(4)} {fromToken}</span>
            {estimatedFee > 0 && (
              <span>Fee: ~{estimatedFee.toFixed(4)} {fromToken}</span>
            )}
          </div>
        </div>

        {/* Transfer Info */}
        {currentRoute && (
          <div className="p-3 rounded-lg bg-[var(--card-background)] border border-[var(--card-border)] text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Route:</span>
              <span className="text-[var(--text-primary)]">{currentRoute.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Est. Time:</span>
              <span className="text-[var(--text-primary)]">{currentRoute.estimatedTime}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20">
            <AlertCircle className="w-4 h-4 text-[var(--error)] mt-0.5" />
            <p className="text-sm text-[var(--error)]">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-green-500 font-medium">✅ XCM Transfer Submitted!</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {success.txHash}
                  </p>
                  <p className="text-xs text-[var(--polkadot-pink)] mt-2">
                    💡 Check your wallet and refresh the page in ~30 seconds to see updated balances
                  </p>
                </div>
              </div>
              <a
                href={success.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[var(--astar-blue)] hover:underline"
              >
                View in Polkadot.js Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Transfer Button */}
        <Button
          onClick={handleTransfer}
          disabled={!amount || isTransferring || !currentRoute || parseFloat(amount) <= 0}
          variant="primary"
          className="w-full"
        >
          {isTransferring ? (
            <>
              <Spinner size="sm" />
              <span>Processing XCM Transfer...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Execute XCM Transfer</span>
            </>
          )}
        </Button>

        {/* Important Notice */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-[var(--astar-blue)]/10 to-[var(--polkadot-pink)]/10 border-2 border-[var(--astar-blue)]/30 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-[var(--astar-blue)] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                ⚡ Real XCM Transfers (Testnet)
              </p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                This executes REAL XCM transfers using your testnet tokens. The transaction will:
              </p>
              <ol className="text-xs text-[var(--text-secondary)] space-y-1 list-decimal list-inside mt-2">
                <li>Prompt Polkadot.js Extension for signature</li>
                <li>Submit XCM transaction to {currentRoute ? CHAIN_METADATA[fromChain].name : 'source chain'}</li>
                <li>Route through Relay Chain to destination</li>
                <li>Complete in {currentRoute?.estimatedTime || '~30-60 seconds'}</li>
              </ol>
              <div className="mt-2 pt-2 border-t border-[var(--card-border)]">
                <p className="text-xs text-[var(--text-secondary)]">
                  <strong className="text-[var(--polkadot-pink)]">Note:</strong> Testnet XCM may fail due to configuration differences. If it doesn't work, the UI still demonstrates the concept for judges. Refresh page after transfer to see updated balances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

