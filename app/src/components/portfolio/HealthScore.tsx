/**
 * Portfolio Health Score Component
 * 
 * Displays a visual health score with breakdown and recommendations
 */

'use client';

import { useMultiChain } from '@/contexts/MultiChainContext';
import { calculateHealthScore, getHealthColor, getHealthStatus } from '@/lib/utils/healthScore';
import { Card } from '@/components/ui/Card';
import { Activity, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function HealthScore() {
  const { portfolio } = useMultiChain();
  const [showDetails, setShowDetails] = useState(false);

  if (!portfolio || portfolio.totalValue === 0) {
    return null;
  }

  const health = calculateHealthScore(portfolio);
  const color = getHealthColor(health.total);
  const status = getHealthStatus(health.total);

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
            Portfolio Health
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            AI-powered analysis of your holdings
          </p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-[var(--polkadot-pink)] hover:underline"
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>

      {/* Circular Progress Score */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-800"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(health.total / 100) * 351.86} 351.86`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              {health.total}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">/ 100</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="font-semibold text-[var(--text-primary)]">
              {status}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--card-background)] border border-[var(--card-border)] text-xs font-medium">
              Grade {health.grade}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {health.total >= 80
              ? 'Your portfolio is well-optimized!'
              : health.total >= 60
              ? 'Good foundation, room for improvement'
              : 'Consider the recommendations below'}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--polkadot-pink)]" />
          Top Recommendations
        </h4>
        {health.recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-2 p-2 rounded-lg bg-[var(--card-background)] border border-[var(--card-border)]"
          >
            <AlertCircle className="w-4 h-4 text-[var(--astar-blue)] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[var(--text-secondary)]">{rec}</p>
          </div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <div className="pt-4 border-t border-[var(--card-border)] space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Score Breakdown
          </h4>

          {/* Diversification */}
          <ScoreBar
            label="Diversification"
            score={health.diversification}
            maxScore={30}
            icon={<Activity className="w-4 h-4" />}
          />

          {/* Risk Balance */}
          <ScoreBar
            label="Risk Balance"
            score={health.riskBalance}
            maxScore={25}
            icon={<CheckCircle className="w-4 h-4" />}
          />

          {/* Activity */}
          <ScoreBar
            label="Activity Potential"
            score={health.activity}
            maxScore={25}
            icon={<TrendingUp className="w-4 h-4" />}
          />

          {/* Size */}
          <ScoreBar
            label="Portfolio Size"
            score={health.size}
            maxScore={20}
            icon={<Activity className="w-4 h-4" />}
          />
        </div>
      )}
    </Card>
  );
}

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
}

function ScoreBar({ label, score, maxScore, icon }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100;
  const color =
    percentage >= 80 ? '#10b981' : percentage >= 60 ? '#3b82f6' : '#f59e0b';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span style={{ color }}>{icon}</span>
          <span>{label}</span>
        </div>
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}

