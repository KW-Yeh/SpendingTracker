'use client';

import { ChartContainer } from '@/app/analysis/ChartContainer';
import {
  CHART_COLORS,
  GRAY_COLORS,
  MONEY_COLORS,
  PRIMARY_COLORS,
} from '@/styles/colors';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import { normalizeNumber } from '@/utils/normalizeNumber';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const compactAmount = (value: number) => {
  if (Math.abs(value) >= 10000) return `${Math.round(value / 1000)}k`;
  return normalizeNumber(Math.round(value));
};

const moneyTooltip = (value: number | string) =>
  `$${normalizeNumber(Number(value))}`;

const ChartEmptyState = ({ children }: { children: string }) => (
  <div className="flex h-56 w-full items-center justify-center rounded-xl bg-gray-800 text-sm text-gray-400">
    {children}
  </div>
);

export const SpendingTrendChart = ({
  months,
}: {
  months: AnalysisMonthlyPoint[];
}) => (
  <ChartContainer
    title="12 個月支出趨勢"
    subtitle="柱狀為每月支出；趨勢線採 3 個月移動平均，虛線為每月預算。"
  >
    <div className="h-72 w-full sm:h-80" data-testid="spending-trend-chart">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={months}
          margin={{ top: 12, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid stroke={GRAY_COLORS[300]} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: GRAY_COLORS[700], fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={compactAmount}
            tick={{ fill: GRAY_COLORS[700], fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip
            formatter={(value) => moneyTooltip(value as number | string)}
            contentStyle={{
              border: `1px solid ${GRAY_COLORS[400]}`,
              borderRadius: 11,
              background: GRAY_COLORS[50],
              color: GRAY_COLORS[950],
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar
            dataKey="outcome"
            name="每月支出"
            fill={PRIMARY_COLORS[500]}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
            isAnimationActive={false}
          />
          <Line
            dataKey="movingAverage"
            name="3 月平均"
            stroke={MONEY_COLORS.expense}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Line
            dataKey="budget"
            name="每月預算"
            stroke={GRAY_COLORS[600]}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </ChartContainer>
);

export const CategoryChangeChart = ({
  changes,
  previousMonthLabel,
}: {
  changes: AnalysisCategoryChange[];
  previousMonthLabel: string;
}) => {
  if (changes.length === 0) {
    return (
      <ChartContainer
        title="支出變化來源"
        subtitle={`與 ${previousMonthLabel} 比較。`}
      >
        <div data-testid="category-change-chart" className="w-full">
          <ChartEmptyState>目前沒有可比較的類別資料</ChartEmptyState>
        </div>
      </ChartContainer>
    );
  }

  const maxChange = Math.max(
    1,
    ...changes.map((item) => Math.abs(item.change)),
  );

  return (
    <ChartContainer
      title="支出變化來源"
      subtitle={`與 ${previousMonthLabel} 比較，顯示影響最大的五個類別。`}
    >
      <div className="h-64 w-full sm:h-72" data-testid="category-change-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={changes}
            layout="vertical"
            margin={{ top: 4, right: 12, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke={GRAY_COLORS[300]} horizontal={false} />
            <XAxis
              type="number"
              domain={[-maxChange, maxChange]}
              tickFormatter={compactAmount}
              tick={{ fill: GRAY_COLORS[700], fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={48}
              tick={{ fill: GRAY_COLORS[900], fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine x={0} stroke={GRAY_COLORS[600]} />
            <Tooltip
              formatter={(value) => moneyTooltip(value as number | string)}
              contentStyle={{
                border: `1px solid ${GRAY_COLORS[400]}`,
                borderRadius: 11,
                background: GRAY_COLORS[50],
                color: GRAY_COLORS[950],
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="change"
              name="較上月增減"
              radius={[4, 4, 4, 4]}
              isAnimationActive={false}
            >
              {changes.map((item) => (
                <Cell
                  key={item.category}
                  fill={
                    item.change > 0 ? MONEY_COLORS.expense : MONEY_COLORS.income
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 grid w-full gap-2 sm:grid-cols-2">
        {changes.map((item) => (
          <li
            key={item.category}
            data-change-direction={
              item.change > 0
                ? 'increase'
                : item.change < 0
                  ? 'decrease'
                  : 'flat'
            }
            className="flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2 text-xs"
          >
            <span className="flex items-center gap-1.5 text-gray-300">
              <span aria-hidden className="text-gray-400">
                {getCategoryIcon(item.category, 'size-4')}
              </span>
              {item.label}
            </span>
            <strong
              className={`tabular-nums ${
                item.change > 0
                  ? 'text-[var(--color-expense)]'
                  : item.change < 0
                    ? 'text-[var(--color-income)]'
                    : 'text-gray-400'
              }`}
            >
              {item.change > 0 ? '+' : item.change < 0 ? '-' : ''}$
              {normalizeNumber(Math.abs(item.change))}
            </strong>
          </li>
        ))}
      </ul>
    </ChartContainer>
  );
};

export const NecessityTrendChart = ({
  months,
}: {
  months: AnalysisMonthlyPoint[];
}) => (
  <ChartContainer
    title="必要與額外支出"
    subtitle="觀察近六個月的消費結構；每根柱狀合計為 100%。"
  >
    <div className="h-64 w-full sm:h-72" data-testid="necessity-trend-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={months}
          margin={{ top: 12, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid stroke={GRAY_COLORS[300]} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: GRAY_COLORS[700], fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: GRAY_COLORS[700], fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            formatter={(value) => `${Number(value).toFixed(1)}%`}
            contentStyle={{
              border: `1px solid ${GRAY_COLORS[400]}`,
              borderRadius: 11,
              background: GRAY_COLORS[50],
              color: GRAY_COLORS[950],
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar
            dataKey="necessaryPercent"
            name="必要支出"
            stackId="necessity"
            fill={CHART_COLORS.OUTCOME_NECESSARY}
            radius={[0, 0, 3, 3]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="unnecessaryPercent"
            name="額外支出"
            stackId="necessity"
            fill={PRIMARY_COLORS[300]}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </ChartContainer>
);
