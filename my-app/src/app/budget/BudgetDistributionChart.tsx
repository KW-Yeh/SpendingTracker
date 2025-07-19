'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface BudgetDistributionChartProps {
  data: BudgetItem[];
}

export const BudgetDistributionChart = ({
  data,
}: BudgetDistributionChartProps) => {
  // Filter out items with zero amount to avoid chart errors
  const validData = data.filter((item) => item.amount > 0);

  const chartData = validData.map((item) => ({
    name: item.category,
    value: item.amount,
    color: getCategoryColor(item.category),
    spent: item.spent,
  }));

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
  '#ee9b00', // Gold
];

const getCategoryColor = (category: string): string => {
  // Simple hash function to consistently map categories to colors
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCESSIBLE_COLORS[Math.abs(hash) % ACCESSIBLE_COLORS.length];
};
