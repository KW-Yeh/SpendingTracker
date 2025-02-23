'use client';

import { ChartContainer } from '@/app/list/ChartContainer';
import { CostTable } from '@/app/list/CostTable';
import { Filter } from '@/app/list/Filter';
import { Loading } from '@/components/icons/Loading';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useMounted } from '@/hooks/useMounted';
import { calSpending2Chart } from '@/utils/calSpending2Chart';
import { normalizeNumber } from '@/utils/normalizeNumber';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Cell, Label, Pie, PieChart, Tooltip } from 'recharts';

const renderCustomizedLabelForPieCell = (props: {
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
  const isMounted = useMounted();
  const [chartData, setChartData] = useState<PieChartData>({
    income: {
      list: [],
      total: 0,
      necessary: 0,
      unnecessary: 0,
      necessaryList: [],
      unnecessaryList: [],
    },
    outcome: {
      list: [],
      total: 0,
      necessary: 0,
      unnecessary: 0,
      necessaryList: [],
      unnecessaryList: [],
    },
  });
  const today = new Date();
  const [year, setYear] = useState(`${today.getFullYear()}`);
  const [month, setMonth] = useState(`${today.getMonth() + 1}`);
  const [groupId, setGroupId] = useState<string>('');

  const totalIncomePercentage = useMemo(() => {
    if (chartData.income.total === 0) return 0;
    return (
      (chartData.income.total * 100) /
      (chartData.income.total + chartData.outcome.total)
    );
  }, [chartData.income.total, chartData.outcome.total]);

  const totalOutcomePercentage = useMemo(() => {
    if (chartData.outcome.total === 0) return 0;
    return (
      (chartData.outcome.total * 100) /
      (chartData.income.total + chartData.outcome.total)
    );
  }, [chartData.income.total, chartData.outcome.total]);

  const totalOutcomeNecessaryPercentage = useMemo(() => {
    if (chartData.outcome.necessary === 0) return 0;
    return (
      (chartData.outcome.necessary * 100) /
      (chartData.outcome.necessary + chartData.outcome.unnecessary)
    );
  }, [chartData.outcome.necessary, chartData.outcome.unnecessary]);

  const totalOutcomeUnnecessaryPercentage = useMemo(() => {
    if (chartData.outcome.unnecessary === 0) return 0;
    return (
      (chartData.outcome.unnecessary * 100) /
      (chartData.outcome.necessary + chartData.outcome.unnecessary)
    );
  }, [chartData.outcome.necessary, chartData.outcome.unnecessary]);

  const refreshData = useCallback(
    (_groupId: string | undefined, _year: string, _month: string) => {
      console.log(
        `Get Data of group: ${_groupId}, user: ${userData?.email}, year: ${Number(_year)}, month: ${Number(_month) - 1}`,
      );
      syncData(
        _groupId,
        userData?.email,
        new Date(Number(_year), Number(_month)).toUTCString(),
      );
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

  useEffect(() => {
    if (filteredData.length >= 0) {
      startTransition(() => {
        setChartData(calSpending2Chart(filteredData));
      });
    }
  }, [filteredData]);

  return (
    <div className="flex w-full max-w-175 flex-col items-center gap-6">
      <div className="flex items-center gap-4 text-base sm:text-lg">
        <Filter
          refreshData={refreshData}
          groupOptions={{
            setGroupId,
            loadingGroups,
            groups,
            group,
          }}
          dateOptions={{
            today,
            year,
            setYear,
            month,
            setMonth,
          }}
        />
      </div>

      <ChartContainer title="收支類別比例">
        <div className="flex w-full flex-wrap justify-center gap-4">
          <div className="size-fit sm:sticky sm:top-20">
            {isMounted ? (
              <PieChart width={300} height={300}>
                <Pie
                  data={[
                    { name: '支出', value: chartData.outcome.total },
                    { name: '收入', value: chartData.income.total },
                  ]}
                  dataKey="value"
                  label={renderCustomizedLabelForPieCell}
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
                  data={[...chartData.outcome.list, ...chartData.income.list]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {[...chartData.outcome.list, ...chartData.income.list].map(
                    (entry, index) => (
                      <Cell
                        className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ),
                  )}
                  <Label
                    value={`盈餘 ＄${normalizeNumber(chartData.income.total - chartData.outcome.total)}`}
                    offset={0}
                    position="center"
                    className="text-sm font-bold"
                  />
                </Pie>

                <Tooltip />
              </PieChart>
            ) : (
              <div className="flex size-[300px] items-center justify-center">
                <Loading className="size-10 animate-spin py-1 text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <CostTable
              title={`支出各項資訊 ＄${normalizeNumber(chartData.outcome.total)}（${totalOutcomePercentage.toFixed(0)}%）`}
              total={chartData.income.total + chartData.outcome.total}
              list={chartData.outcome.list}
              options={{
                headerStyle: 'bg-red-500/30',
              }}
            />
            <CostTable
              title={`收入各項資訊 ＄${normalizeNumber(chartData.income.total)}（${totalIncomePercentage.toFixed(0)}%）`}
              total={chartData.income.total + chartData.outcome.total}
              list={chartData.income.list}
              options={{
                headerStyle: 'bg-green-500/30',
              }}
            />
          </div>
        </div>
      </ChartContainer>

      <ChartContainer title="支出類別比例（必要 vs 額外）">
        <div className="flex w-full flex-wrap justify-center gap-4">
          <div className="size-fit sm:sticky sm:top-20">
            {isMounted ? (
              <PieChart width={300} height={300}>
                <Pie
                  data={[
                    { name: '必要支出', value: chartData.outcome.necessary },
                    { name: '額外支出', value: chartData.outcome.unnecessary },
                  ]}
                  dataKey="value"
                  label={renderCustomizedLabelForPieCell}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={90}
                >
                  <Cell
                    className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
                    fill="#fdba74"
                  />
                  <Cell
                    className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
                    fill="#d1d5db"
                  />
                </Pie>

                <Pie
                  data={[
                    ...chartData.outcome.necessaryList,
                    ...chartData.outcome.unnecessaryList,
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {[
                    ...chartData.outcome.necessaryList,
                    ...chartData.outcome.unnecessaryList,
                  ].map((entry, index) => (
                    <Cell
                      className="transition-colors hover:fill-yellow-300 hover:outline-0 active:outline-0"
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                  <Label
                    value={`財務剛性 ${(
                      chartData.outcome.necessary /
                      chartData.outcome.unnecessary
                    ).toFixed(2)}`}
                    offset={0}
                    position="center"
                    className="text-sm font-bold"
                  />
                </Pie>

                <Tooltip />
              </PieChart>
            ) : (
              <div className="flex size-[300px] items-center justify-center">
                <Loading className="size-10 animate-spin py-1 text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <CostTable
              title={`必要支出各項資訊 ＄${normalizeNumber(chartData.outcome.necessary)}（${totalOutcomeNecessaryPercentage.toFixed(0)}%）`}
              total={
                chartData.outcome.necessary + chartData.outcome.unnecessary
              }
              list={chartData.outcome.necessaryList}
              options={{
                headerStyle: 'bg-orange-500/30',
              }}
            />
            <CostTable
              title={`額外支出各項資訊 ＄${normalizeNumber(chartData.outcome.unnecessary)}（${totalOutcomeUnnecessaryPercentage.toFixed(0)}%）`}
              total={
                chartData.outcome.necessary + chartData.outcome.unnecessary
              }
              list={chartData.outcome.unnecessaryList}
              options={{
                headerStyle: 'bg-gray-500/30',
              }}
            />
          </div>
        </div>
      </ChartContainer>
    </div>
  );
};
