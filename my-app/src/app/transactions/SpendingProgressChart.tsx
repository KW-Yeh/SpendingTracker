'use client';

import { PRIMARY_COLORS } from '@/styles/colors';
import { normalizeNumber } from '@/utils/normalizeNumber';
import {
  Area,
  Bar,
  BarChart,
  ComposedChart,
  DefaultTooltipContentProps,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface SpendingProgressPoint {
  day: number;
  label: string;
  daily: number;
  actual: number | null;
  budget: number | null;
}

interface Props {
  data: SpendingProgressPoint[];
  isMobile: boolean;
  mode: 'budget' | 'recent';
  reportingDay?: number;
}

const SpendingProgressChart = ({
  data,
  isMobile,
  mode,
  reportingDay,
}: Props) => {
  const height = isMobile ? 130 : 165;
  const firstDay = data[0]?.day ?? 1;
  const lastDay = data.at(-1)?.day ?? firstDay;
  const middleDay = Math.round((firstDay + lastDay) / 2);
  const ticks = Array.from(new Set([firstDay, middleDay, lastDay]));

  if (mode === 'recent') {
    return (
      <div className="w-full" role="img" aria-label="近七日每日花費圖">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 6, right: 8, left: 8, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              ticks={ticks}
              tick={{ fill: '#86868B', fontSize: 11 }}
              tickFormatter={(day: number) =>
                data.find((point) => point.day === day)?.label ?? String(day)
              }
            />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip
              cursor={{ fill: 'rgba(0, 102, 204, 0.05)' }}
              content={<ChartTooltip showBudget={false} />}
            />
            <Bar
              dataKey="daily"
              fill={PRIMARY_COLORS[500]}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full" role="img" aria-label="累積花費與預算進度比較圖">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            ticks={ticks}
            tick={{ fill: '#86868B', fontSize: 11 }}
            tickFormatter={(day: number) =>
              data.find((point) => point.day === day)?.label ?? String(day)
            }
          />
          <YAxis hide domain={[0, 'auto']} />
          <Tooltip
            cursor={{ stroke: '#D2D2D7', strokeDasharray: '3 3' }}
            content={<ChartTooltip showBudget />}
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke={PRIMARY_COLORS[500]}
            strokeWidth={2.5}
            fill="rgba(0, 102, 204, 0.10)"
            dot={false}
            activeDot={{ r: 4, fill: PRIMARY_COLORS[500], strokeWidth: 0 }}
            connectNulls={false}
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="budget"
            stroke="#A1A1A6"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          {reportingDay ? (
            <ReferenceLine
              x={reportingDay}
              stroke="#D2D2D7"
              strokeDasharray="2 4"
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingProgressChart;

const ChartTooltip = (
  props: DefaultTooltipContentProps<number, string> & {
    showBudget: boolean;
  },
) => {
  const point = props.payload?.[0]?.payload as
    | SpendingProgressPoint
    | undefined;
  if (!point) return null;

  return (
    <div className="flex min-w-32 flex-col gap-1 rounded-xl border border-black/[0.08] bg-white p-2.5 text-xs shadow-sm">
      <span className="font-semibold text-gray-200">{point.label}</span>
      {props.showBudget ? (
        <>
          <span className="text-primary-500">
            累積 ${normalizeNumber(point.actual ?? 0)}
          </span>
          <span className="text-gray-400">
            當日 ${normalizeNumber(point.daily)}
          </span>
          <span className="text-gray-400">
            預算進度 ${normalizeNumber(point.budget ?? 0)}
          </span>
        </>
      ) : (
        <span className="text-primary-500">
          花費 ${normalizeNumber(point.daily)}
        </span>
      )}
    </div>
  );
};
