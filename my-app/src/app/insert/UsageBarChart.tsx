'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import { startTransition, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  DefaultTooltipContentProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

const UsageBarChart = (props: Props) => {
  const { init, month, data, isMobile, handleOnClick } = props;
  const [dataList, setDataList] = useState<DataType[]>(formatData(init, month));

  useEffect(() => {
    startTransition(() => {
      setDataList(formatData(data, month));
    });
  }, [data, month]);

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
      <BarChart
        data={dataList}
        barSize={isMobile ? 5 : 12}
        onClick={handleOnClick}
      >
        <CartesianGrid strokeDasharray="3 3" syncWithTicks />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" tick={false} width={4} />
        <Tooltip content={CustomToolTip} />
        <Bar yAxisId="left" dataKey="cost" fill="hsl(256, 60%, 70%)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UsageBarChart;

function formatData(list: number[], month: number) {
  const result: DataType[] = [];
  list.forEach((item, index) => {
    result.push({
      date: `${(month + 1).toString().padStart(2, '0')}/${(index + 1).toString().padStart(2, '0')}`,
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
