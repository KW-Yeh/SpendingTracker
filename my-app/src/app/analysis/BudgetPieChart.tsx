'use client';

import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts';
import { customPieLabel } from './customPieLabel';
import { CHART_COLORS } from '@/styles/colors';

interface Props {
  totalBudgeted: number;
  totalSpent: number;
  totalNecessary: number;
  totalUnnecessary: number;
  categoryList: {
    name: string;
    value: number;
    color: string;
  }[];
}

const BudgetPieChart = (props: Props) => {
  const { totalBudgeted, totalSpent, totalNecessary, totalUnnecessary, categoryList } = props;
  const remaining = Math.max(0, totalBudgeted - totalSpent);
  const usagePercent = totalBudgeted > 0 ? ((totalSpent / totalBudgeted) * 100).toFixed(1) : '0.0';

  return (
    <PieChart width={300} height={300}>
      {/* Outer ring: Budget vs Spent */}
      <Pie
        data={[
          { name: '已使用', value: totalSpent },
          { name: '剩餘', value: remaining },
        ]}
        dataKey="value"
        label={customPieLabel}
        cx="50%"
        cy="50%"
        innerRadius={85}
        outerRadius={90}
      >
        <Cell
          className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
          fill={totalSpent > totalBudgeted ? CHART_COLORS.OUTCOME_UNNECESSARY : CHART_COLORS.OUTCOME_NECESSARY}
        />
        <Cell
          className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
          fill={CHART_COLORS.NEUTRAL}
        />
      </Pie>

      {/* Inner ring: Necessary vs Unnecessary */}
      <Pie
        data={[
          { name: '必要支出', value: totalNecessary },
          { name: '額外支出', value: totalUnnecessary },
        ]}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
      >
        <Cell
          className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
          fill={CHART_COLORS.OUTCOME_NECESSARY}
        />
        <Cell
          className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
          fill={CHART_COLORS.NEUTRAL}
        />
        <Label
          value={`使用率 ${usagePercent}%`}
          offset={0}
          position="center"
          className="text-sm font-bold"
        />
      </Pie>

      <Tooltip />
    </PieChart>
  );
};

export default BudgetPieChart;
