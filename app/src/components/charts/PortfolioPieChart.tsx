/**
 * Portfolio Pie Chart Component
 * 
 * Visualizes portfolio distribution across chains.
 * Uses Recharts library for beautiful, interactive charts.
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useMultiChain } from '@/contexts/MultiChainContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CHAINS } from '@/lib/utils/constants';
import { formatUSD, formatPercent } from '@/lib/utils/formatters';

export function PortfolioPieChart() {
  const { portfolio } = useMultiChain();

  if (!portfolio || portfolio.totalValue === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-center">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                No portfolio data available yet.
                <br />
                Connect your wallet to see the distribution.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for chart
  const chartData = portfolio.chains
    .filter(c => c.totalValue > 0)
    .map(chain => ({
      name: chain.chainName,
      value: chain.totalValue,
      percentage: chain.percentage,
      color: CHAINS[chain.chain].color
    }));

  if (chartData.length === 0) {
    return null;
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-background)] p-3 shadow-lg">
          <p className="font-semibold text-[var(--text-primary)]">{data.name}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {formatUSD(data.value)}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            {data.percentage.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} ${entry.percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-[var(--text-primary)]">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chain Legend with values */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {chartData.map((chain) => (
            <div 
              key={chain.name}
              className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--hover)] p-3"
            >
              <div 
                className="h-4 w-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: chain.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {chain.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {formatUSD(chain.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


