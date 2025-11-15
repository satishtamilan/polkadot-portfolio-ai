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

  // Prepare data for chart - ALWAYS show ALL 4 chains
  const allChains = portfolio.chains.map(chain => ({
    name: chain.chainName,
    value: chain.totalValue > 0 ? chain.totalValue : 0.01, // Show at least 0.01 for visibility
    actualValue: chain.totalValue,
    percentage: chain.percentage,
    color: CHAINS[chain.chain].color,
    hasBalance: chain.totalValue > 0
  }));

  // Use ALL chains - don't filter any out!
  const finalChartData = allChains;

  console.log('Portfolio chains for pie chart:', portfolio.chains);
  console.log('All chains data:', allChains);
  console.log('Final chart data:', finalChartData);

  if (finalChartData.length === 0) {
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
                data={finalChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} ${entry.percentage > 0.1 ? entry.percentage.toFixed(1) : '<0.1'}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {finalChartData.map((entry, index) => (
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
          {finalChartData.map((chain) => (
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
                  {chain.name} {!chain.hasBalance && '(Empty)'}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {chain.actualValue > 0 ? formatUSD(chain.actualValue) : '$0.00'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


