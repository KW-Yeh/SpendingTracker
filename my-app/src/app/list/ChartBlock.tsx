'use client';
import { ChartContainer } from '@/app/list/ChartContainer';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { calSpending2Chart } from '@/utils/calSpending2Chart';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import { useEffect, useState, useTransition } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), {
  ssr: false,
});

const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), {
  ssr: false,
});

const renderCustomizedLabel = (props: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}) => {
  const { cx, cy, midAngle, outerRadius, percent, name } = props;
  const x = cx + outerRadius * 1.25 * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + outerRadius * 1.35 * Math.sin((-midAngle * Math.PI) / 180);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="rounded-md bg-background p-1 text-xs"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const ChartBlock = () => {
  const { data } = useGetSpendingCtx();
  const [loading, startTransition] = useTransition();
  const [chartData, setChartData] = useState<PieChartData>({
    income: {
      list: [],
      total: 0,
      necessary: 0,
      unnecessary: 0,
    },
    outcome: {
      list: [],
      total: 0,
      necessary: 0,
      unnecessary: 0,
    },
  });
  const [detailData, setDetailData] = useState<PieChartDataItem[]>([]);

  useEffect(() => {
    startTransition(() => {
      const formattedData = calSpending2Chart(data);
      setChartData(formattedData);
      setDetailData([
        ...formattedData.outcome.list,
        ...formattedData.income.list,
      ]);
    });
  }, [data]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer title="收支比例與各項占比">
        <PieChart width={300} height={250}>
          <Pie
            data={[
              { name: '支出', value: chartData.outcome.total },
              { name: '收入', value: chartData.income.total },
            ]}
            dataKey="value"
            label={renderCustomizedLabel}
            cx="50%"
            cy="50%"
            innerRadius={85}
            outerRadius={90}
          >
            <Cell
              className="transition-colors hover:fill-yellow-300 hover:outline-0"
              fill="#faa5a5"
            />
            <Cell
              className="transition-colors hover:fill-yellow-300 hover:outline-0"
              fill="#82ca9d"
            />
          </Pie>

          <Pie
            data={detailData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
          >
            {detailData.map((entry, index) => (
              <Cell
                className="transition-colors hover:fill-yellow-300 hover:outline-0"
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
            <Label
              value={`盈餘 $${normalizeNumber(chartData.income.total - chartData.outcome.total)}`}
              offset={0}
              position="center"
              className="text-sm font-bold"
            />
          </Pie>

          <Tooltip />
        </PieChart>
      </ChartContainer>

      <ChartContainer title="各項開銷之必要與非必要占比">
        <BarChart
          width={300}
          height={250}
          data={chartData.outcome.list}
          margin={{
            top: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend
            align="right"
            verticalAlign="bottom"
            payload={[
              { value: '必要花費', type: 'rect', color: '#8884d8' },
              { value: '不必要花費', type: 'rect', color: '#82ca9d' },
            ]}
          />
          <Bar dataKey="necessary" stackId="a" fill="#8884d8" />
          <Bar dataKey="unnecessary" stackId="a" fill="#82ca9d" />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
