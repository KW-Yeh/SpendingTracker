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
  isMobile: boolean;
}

const UsagePieChart = (props: Props) => {
  const { totalIncome, totalOutcome, isMobile } = props;
  const percent = totalIncome ? totalOutcome / totalIncome : 0;
  const isOverSpent = totalOutcome > totalIncome;
  return (
    <ResponsiveContainer
      minWidth={120}
      width="100%"
      style={{
        maxWidth: '200px',
        aspectRatio: 1,
      }}
    >
      <PieChart>
        <Pie
          dataKey="value"
          data={[
            { name: '使用', value: totalOutcome, fill: 'hsl(256, 60%, 70%)' },
            {
              name: '剩餘',
              value: isOverSpent ? 0 : totalIncome - totalOutcome,
              fill: 'hsl(256, 60%, 90%)',
            },
          ]}
          isAnimationActive={false}
          outerRadius={isMobile ? 60 : 70}
          innerRadius={isMobile ? 45 : 50}
        />
        <Tooltip content={CustomToolTip} />
        <text
          x="50%"
          y="50%"
          fill="hsl(256, 60%, 30%)"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {`${Math.min(percent * 100, 100).toFixed(0)}%`}
        </text>
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
