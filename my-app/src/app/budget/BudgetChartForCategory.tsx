'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const BudgetChartForCategory = ({ data }: { data: Allocation[] }) => {
  return (
    <div className="flex h-96 w-full max-w-200 flex-col items-center self-center pt-6">
      <h2 className="mb-4 text-xl font-semibold">預算分類長條圖</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" textAnchor="middle" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="budget"
            fill="var(--color-primary-300)"
            radius={[4, 4, 0, 0]}
          >
            <LabelList dataKey="percentage" content={CustomLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChartForCategory;

const CustomLabel = ({
  x = 0,
  y = 0,
  value = 0,
}: {
  x?: number | string;
  y?: number | string;
  value?: number | string;
}) => {
  return (
    <text
      x={Number(x) + 5}
      y={Number(y) - 8}
      fill="var(--color-gray-500)"
      fontSize={12}
      textAnchor="left"
    >
      {Number(value).toFixed(2)}%
    </text>
  );
};
