'use client';

import { normalizeNumber } from '@/utils/normalizeNumber';
import { startTransition, useEffect, useState } from 'react';
import {
  DefaultTooltipContentProps,
  Line,
  LineChart,
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

  return (
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={dataList} onClick={handleOnClick}>
        <Line
          type="linear"
          dataKey="cost"
          stroke="hsl(256, 60%, 70%)"
          strokeWidth={2}
          dot={{ stroke: 'hsl(256, 60%, 70%)', r: isMobile ? 2 : 3 }}
        />
        <Tooltip content={CustomToolTip} />
      </LineChart>
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
    <div className="bg-background flex flex-col rounded p-2 text-xs shadow">
      <span className="text-primary-700">
        花費：${normalizeNumber(payload.cost)}
      </span>
      <span className="text-xs">{payload.date}</span>
    </div>
  );
};
