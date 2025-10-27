'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import { startTransition, useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
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
  cumulation: number;
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

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 150 : 200}>
      <AreaChart data={dataList} onClick={handleOnClick}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(256, 60%, 70%)"
              stopOpacity={0.8}
            />
            <stop offset="95%" stopColor="hsl(256, 60%, 70%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="cumulation"
          stroke="hsl(256, 60%, 70%)"
          fill="url(#colorUv)"
          dot={{ stroke: 'hsl(256, 60%, 70%)', r: 1 }}
        />
        <Tooltip content={CustomToolTip} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default UsageLineChart;

function formatData(list: number[], month: number) {
  const result: DataType[] = [];
  let cumulation = 0;
  list.forEach((item, index) => {
    cumulation += item;
    result.push({
      date: `${(month + 1).toString().padStart(2, '0')}/${(index + 1).toString().padStart(2, '0')}`,
      cumulation: cumulation,
      cost: item,
    });
  });
  return result;
}

const CustomToolTip = (props: DefaultTooltipContentProps<string, string>) => {
  if (!props.payload) return null;
  const payload = props.payload[0]?.payload;
  if (!payload) return null;
  return (
    <div className="bg-background flex flex-col rounded p-2 text-xs shadow">
      <span className="text-primary-700">
        花費：${normalizeNumber(payload.cost)}
      </span>
      <span className="text-xs">{payload.date}</span>
    </div>
  );
};
