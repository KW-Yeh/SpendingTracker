'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import {
  DefaultTooltipContentProps,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface Props {
  totalIncome: number;
  totalOutcome: number;
}

const UsagePieChart = (props: Props) => {
  const { totalIncome, totalOutcome } = props;
  return (
    <ResponsiveContainer width={100} height={100}>
      <PieChart>
        <Pie
          dataKey="value"
          data={[
            { name: '使用', value: totalOutcome, fill: 'hsl(256, 60%, 70%)' },
            {
              name: '剩餘',
              value: totalIncome - totalOutcome,
              fill: 'hsl(256, 60%, 90%)',
            },
          ]}
          label={() => <CustomizedLabel percent={totalOutcome / totalIncome} />}
          outerRadius={50}
          innerRadius={35}
        />
        <Tooltip content={CustomToolTip} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default UsagePieChart;

const CustomToolTip = (props: DefaultTooltipContentProps<string, string>) => {
  if (!props.payload) return null;
  const payload = props.payload[0]?.payload;
  if (!payload) return null;
  return (
    <div className="bg-background flex flex-col rounded p-2 text-xs shadow">
      <span className="text-primary-700">
        {payload.name}：${normalizeNumber(payload.value)}
      </span>
    </div>
  );
};

const CustomizedLabel = ({ percent }: { percent: number }) => {
  return (
    <text
      x="50%"
      y="50%"
      fill="hsl(256, 60%, 30%)"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
