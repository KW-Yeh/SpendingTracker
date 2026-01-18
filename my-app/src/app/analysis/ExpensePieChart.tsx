'use client';

import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts';
import { customPieLabel } from './customPieLabel';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { CHART_COLORS } from '@/styles/colors';

interface Props {
  totalIncome: number;
  totalOutcome: number;
  list: PieChartDataItem[];
}

const ExpensePieChart = (props: Props) => {
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={[
          { name: '支出', value: props.totalOutcome },
          { name: '收入', value: props.totalIncome },
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
          fill={CHART_COLORS.OUTCOME_PRIMARY}
        />
        <Cell
          className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
          fill={CHART_COLORS.INCOME_PRIMARY}
        />
      </Pie>

      <Pie
        data={props.list}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
      >
        {props.list.map((entry, index) => (
          <Cell
            className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
            key={`cell-${index}`}
            fill={entry.color}
          />
        ))}
        <Label
          value={`盈餘 $${normalizeNumber(props.totalIncome - props.totalOutcome)}`}
          offset={0}
          position="center"
          className="fill-gray-200 text-sm font-bold"
        />
      </Pie>

      <Tooltip />
    </PieChart>
  );
};

export default ExpensePieChart;
