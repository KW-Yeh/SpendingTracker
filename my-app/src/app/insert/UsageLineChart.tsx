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
  handleOnClick: (state: CategoricalChartState) => void;
}

type DataType = {
  date: string;
  cost: number;
};

const UsageLineChart = (props: Props) => {
  const [dataList, setDataList] = useState<DataType[]>(
    formatData(props.init, props.month),
  );

  useEffect(() => {
    startTransition(() => {
      setDataList(formatData(props.data, props.month));
    });
  }, [props.data, props.month]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={dataList} onClick={props.handleOnClick}>
        <CartesianGrid strokeDasharray="4" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" tick={false} width={4} />
        <Tooltip content={CustomToolTip} />
        <Bar yAxisId="left" dataKey="cost" fill="hsl(256, 60%, 70%)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UsageLineChart;

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
    <div className="bg-background flex flex-col rounded p-2 shadow">
      <span className="text-primary-700">
        花費：${normalizeNumber(payload.cost)}
      </span>
      <span className="text-xs">{payload.date}</span>
    </div>
  );
};
