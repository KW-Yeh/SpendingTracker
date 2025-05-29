'use client';

import { startTransition, useEffect, useState } from 'react';
import {
  CartesianGrid,
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

const UsagePieChart = (props: Props) => {
  const [dataList, setDataList] = useState<DataType[]>(formatData(props.init, props.month));

  useEffect(() => {
    startTransition(() => {
      setDataList(formatData(props.data, props.month));
    });
  }, [props.data, props.month]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={dataList}
        margin={{ right: 30 }}
        onClick={props.handleOnClick}
      >
        <CartesianGrid strokeDasharray="4" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
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

export default UsagePieChart;

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
