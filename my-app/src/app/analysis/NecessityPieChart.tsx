'use client';

import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts';
import { customPieLabel } from './customPieLabel';
import { CHART_COLORS } from '@/styles/colors';

interface Props {
  totalNecessity: number;
  totalUnnecessity: number;
  list: {
    name: string;
    value: number;
    color: string;
  }[];
}

const NecessityPieChart = (props: Props) => {
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={[
          { name: '必要支出', value: props.totalNecessity },
          { name: '額外支出', value: props.totalUnnecessity },
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
          fill={CHART_COLORS.OUTCOME_NECESSARY}
        />
        <Cell
          className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
          fill={CHART_COLORS.NEUTRAL}
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
          value={`財務剛性 ${(props.totalNecessity / props.totalUnnecessity).toFixed(2)}`}
          offset={0}
          position="center"
          className="fill-gray-200 text-sm font-bold"
        />
      </Pie>

      <Tooltip />
    </PieChart>
  );
};

export default NecessityPieChart;
