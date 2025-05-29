'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import { startTransition, useEffect, useState } from 'react';
import {
  CartesianGrid,
  DefaultTooltipContentProps,
  Line,
  LineChart,
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
  cumulative: number;
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
      <LineChart data={dataList} onClick={props.handleOnClick}>
        <CartesianGrid strokeDasharray="4" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" tick={false} width={4} />
        <YAxis yAxisId="right" orientation="right" tick={false} width={4} />
        <Tooltip content={CustomToolTip} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="cumulative"
          stroke="hsl(256, 60%, 50%)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UsageLineChart;

function formatData(list: number[], month: number) {
  const result: DataType[] = [];
  let cumulative = 0;
  list.forEach((item, index) => {
    cumulative += item;
    result.push({
      date: `${(month + 1).toString().padStart(2, '0')}/${(index + 1).toString().padStart(2, '0')}`,
      cumulative,
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
        累積花費：${normalizeNumber(payload.cumulative)}
      </span>
      <span className="text-xs">{payload.date}</span>
    </div>
  );
};
