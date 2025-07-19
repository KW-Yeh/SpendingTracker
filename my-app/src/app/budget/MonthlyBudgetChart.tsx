'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface MonthlyBudgetChartProps {
  data: MonthlyBudgetData[];
}

export const MonthlyBudgetChart = ({ data }: MonthlyBudgetChartProps) => {
  return (
    <div className="flex h-full w-full flex-col">
      <h3 className="mb-4 text-center text-lg font-medium text-gray-800">
        月度預算分配
      </h3>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${normalizeNumber(value)}`, '']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            />
            <Legend />
            {getUniqueCategories(data).map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                fill={getCategoryColor(category, index)}
                name={category}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {getMonthlyTotals(data).map((item) => (
          <div
            key={item.month}
            className="rounded-lg bg-gray-50 p-3 text-center"
          >
            <p className="text-sm font-medium text-gray-700">{item.month}</p>
            <p className="text-lg font-semibold text-gray-800">
              ${normalizeNumber(item.total)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const COLORS = [
  '#8884d8',
  '#83a6ed',
  '#8dd1e1',
  '#82ca9d',
  '#a4de6c',
  '#d0ed57',
  '#ffc658',
  '#ff8042',
  '#ff6361',
  '#bc5090',
];

const getCategoryColor = (category: string, index: number): string => {
  return COLORS[index % COLORS.length];
};

const getUniqueCategories = (data: MonthlyBudgetData[]): string[] => {
  const categories = new Set<string>();

  data.forEach((monthData) => {
    Object.keys(monthData).forEach((key) => {
      if (key !== 'month') {
        categories.add(key);
      }
    });
  });

  return Array.from(categories);
};

const getMonthlyTotals = (
  data: MonthlyBudgetData[],
): { month: string; total: number }[] => {
  return data.map((monthData) => {
    const total = Object.entries(monthData)
      .filter(([key]) => key !== 'month')
      .reduce((sum, [, value]) => sum + (value as number), 0);

    return {
      month: monthData.month,
      total,
    };
  });
};
