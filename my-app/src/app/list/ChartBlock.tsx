'use client';
import { ChartContainer } from '@/app/list/ChartContainer';
import { Select } from '@/components/Select';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { calSpending2Chart } from '@/utils/calSpending2Chart';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  value: number;
}) => {
  const { cx, cy, midAngle, outerRadius, name } = props;
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
      {name}
    </text>
  );
};

export const ChartBlock = () => {
  const { config: userData } = useUserConfigCtx();
  const { data, syncData } = useGetSpendingCtx();
  const { groups, loading: loadingGroups } = useGroupCtx();
  const [loading, setLoading] = useState(true);
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
  const today = new Date();
  const [year, setYear] = useState(`${today.getFullYear()}`);
  const [month, setMonth] = useState(`${today.getMonth() + 1}`);
  const [groupId, setGroupId] = useState<string>('');

  const refreshData = useCallback(
    (_groupId: string) => {
      syncData(_groupId || undefined, userData?.email);
    },
    [syncData, userData?.email],
  );

  const group = useMemo(
    () => groups.find((group) => group.id === groupId),
    [groups, groupId],
  );

  const filteredData = useMemo(
    () =>
      data.filter(
        (record) =>
          `${new Date(record.date).getFullYear()}` === year &&
          `${new Date(record.date).getMonth() + 1}` === month &&
          record.groupId === (groupId || undefined),
      ),
    [data, year, month, groupId],
  );

  const isNoData = useMemo(
    () => data.length > 0 && filteredData.length === 0,
    [data.length, filteredData.length],
  );

  const formattedData = useMemo(
    () => calSpending2Chart(filteredData),
    [filteredData],
  );

  useEffect(() => {
    if (formattedData.income.total > 0 || formattedData.outcome.total > 0) {
      startTransition(() => {
        setChartData(formattedData);
        setDetailData([
          ...formattedData.outcome.list,
          ...formattedData.income.list,
        ]);
        setLoading(false);
      });
    }
  }, [formattedData]);

  useEffect(() => {
    if (isNoData) {
      setLoading(false);
    }
  }, [isNoData]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Select
          name="group"
          value={group?.name ?? '個人'}
          onChange={(_id) => {
            setGroupId(_id);
            refreshData(_id);
          }}
          className="w-36 rounded-full border border-solid border-gray-300 px-4 py-1 transition-colors active:border-text sm:hover:border-text"
          menuStyle="max-w-60"
        >
          <Select.Item value="">個人</Select.Item>
          {!loadingGroups &&
            groups.map((group) => (
              <Select.Item key={group.id} value={group.id}>
                {group.name}
              </Select.Item>
            ))}
        </Select>
        <div className="flex items-center justify-center gap-2 rounded-full border border-solid border-gray-300 px-4 py-1">
          <Select name="year" value={year} onChange={setYear}>
            {Array(11)
              .fill(0)
              .map((_, i) => (
                <Select.Item
                  key={`${today.getFullYear() - 5 + i}`}
                  value={`${today.getFullYear() - 5 + i}`}
                >
                  {`${today.getFullYear() - 5 + i}`}
                </Select.Item>
              ))}
          </Select>
          <span>年</span>
          <Select
            name="month"
            value={month}
            onChange={setMonth}
            className="w-8"
          >
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <Select.Item
                  key={(i + 1).toString()}
                  value={(i + 1).toString()}
                >
                  {i + 1}
                </Select.Item>
              ))}
          </Select>
          <span>月</span>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {isNoData && <div>無資料</div>}
      {!loading && !isNoData && (
        <>
          <ChartContainer title="收支比例與各項占比">
            <ul className="w-full list-disc pl-6">
              <li>總收入: ${normalizeNumber(chartData.income.total)}</li>
              <li>總支出: ${normalizeNumber(chartData.outcome.total)}</li>
            </ul>
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
                  className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
                  fill="#faa5a5"
                />
                <Cell
                  className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
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
                    className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
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
            <ul className="w-full list-disc pl-6">
              <li>
                總必要開銷: ${normalizeNumber(chartData.income.necessary)}
              </li>
              <li>
                總額外開銷: ${normalizeNumber(chartData.outcome.unnecessary)}
              </li>
            </ul>
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
                  { value: '必要開銷', type: 'rect', color: '#8884d8' },
                  { value: '額外開銷', type: 'rect', color: '#82ca9d' },
                ]}
              />
              <Bar dataKey="necessary" stackId="a" fill="#8884d8" />
              <Bar dataKey="unnecessary" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ChartContainer>
        </>
      )}
    </div>
  );
};
