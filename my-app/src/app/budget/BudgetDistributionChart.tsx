'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface BudgetDistributionChartProps {
  data: BudgetItem[];
}

export const BudgetDistributionChart = ({ data }: BudgetDistributionChartProps) => {
  // Filter out items with zero amount to avoid chart errors
  const validData = data.filter(item => item.amount > 0);
  
  const chartData = validData.map(item => ({
    name: item.category,
    value: item.amount,
    color: getCategoryColor(item.category),
    spent: item.spent
  }));
  
  const totalBudget = validData.reduce((sum, item) => sum + item.amount, 0);
  
  // Sort data by amount (descending)
  chartData.sort((a, b) => b.value - a.value);
  
  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-500">沒有預算資料可顯示</p>
      </div>
    );
  }
  
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-full w-full flex-col items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={90}
              innerRadius={40}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string, props: any) => {
                const item = props.payload;
                const percentage = ((value/totalBudget)*100).toFixed(1);
                const spent = item.spent;
                const spentPercentage = value > 0 ? ((spent/value)*100).toFixed(1) : '0.0';
                
                return [
                  <div key="tooltip" className="space-y-1">
                    <div className="font-medium">${normalizeNumber(value)} ({percentage}%)</div>
                    <div className="text-sm text-gray-500">
                      已使用: ${normalizeNumber(spent)} ({spentPercentage}%)
                    </div>
                    <div className="text-xs text-gray-400">
                      剩餘: ${normalizeNumber(Math.max(0, value - spent))}
                    </div>
                  </div>,
                  item.name
                ];
              }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                padding: '12px'
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value, entry: any) => {
                const { payload } = entry;
                const percentage = ((payload.value/totalBudget)*100).toFixed(1);
                return (
                  <span className="inline-flex items-center gap-1.5">
                    <span 
                      className="inline-block size-3 rounded-sm" 
                      style={{ 
                        backgroundColor: payload.color,
                        border: '1px solid rgba(0,0,0,0.2)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    ></span>
                    <span className="text-sm font-medium text-gray-800">
                      {value} ({percentage}%)
                    </span>
                  </span>
                );
              }}
              wrapperStyle={{ paddingTop: '20px' }}
              iconSize={0} // Hide default legend icons
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Accessible color palette with better contrast
// These colors meet WCAG 2.1 AA standards for contrast
const ACCESSIBLE_COLORS = [
  '#003f5c', // Dark blue
  '#58508d', // Purple
  '#bc5090', // Pink
  '#ff6361', // Red
  '#ffa600', // Orange
  '#2f4b7c', // Navy
  '#665191', // Lavender
  '#a05195', // Magenta
  '#d45087', // Rose
  '#f95d6a', // Salmon
  '#005f73', // Teal
  '#0a9396', // Turquoise
  '#94d2bd', // Mint
  '#e9d8a6', // Sand
  '#ee9b00'  // Gold
];

const getCategoryColor = (category: string): string => {
  // Simple hash function to consistently map categories to colors
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCESSIBLE_COLORS[Math.abs(hash) % ACCESSIBLE_COLORS.length];
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if percentage is significant enough (> 3%)
  if (percent < 0.03) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
      stroke="rgba(0,0,0,0.3)"
      strokeWidth={0.5}
      paintOrder="stroke"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
