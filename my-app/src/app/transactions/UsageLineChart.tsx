'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import { PRIMARY_COLORS } from '@/styles/colors';
import { startTransition, useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  DefaultTooltipContentProps,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/types';

interface Props {
  month: number;
  data: number[];
  init: number[];
  isMobile: boolean;
  handleOnClick: (state: CategoricalChartState) => void;
}

type DataType = {
  date: string;
  cost: number;
};

const UsageLineChart = (props: Props) => {
  const { init, month, data, isMobile, handleOnClick } = props;
  const [dataList, setDataList] = useState<DataType[]>(formatData(init, month));

  useEffect(() => {
    startTransition(() => {
      setDataList(formatData(data, month));
    });
  }, [data, month]);

  const peakCost = useMemo(
    () => dataList.reduce((max, d) => Math.max(max, d.cost), 0),
    [dataList],
  );

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 130 : 170}>
      <BarChart
        data={dataList}
        onClick={handleOnClick}
        margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
      >
        <Bar dataKey="cost" radius={[3, 3, 0, 0]}>
          {dataList.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.cost > 0 && entry.cost === peakCost
                  ? PRIMARY_COLORS[400]
                  : 'rgba(34, 211, 238, 0.45)'
              }
            />
          ))}
        </Bar>
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          content={CustomToolTip}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UsageLineChart;

function formatData(list: number[], month: number) {
  return list.map((cost, index) => ({
    date: `${(month + 1).toString().padStart(2, '0')}/${(index + 1).toString().padStart(2, '0')}`,
    cost,
  }));
}

const CustomToolTip = (props: DefaultTooltipContentProps<string, string>) => {
  if (!props.payload) return null;
  const payload = props.payload[0]?.payload;
  if (!payload) return null;
  return (
    <div className="bg-background flex flex-col rounded p-2 text-xs shadow">
      <span
        className="text-primary-300"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        花費：${normalizeNumber(payload.cost)}
      </span>
      <span className="text-xs">{payload.date}</span>
    </div>
  );
};
