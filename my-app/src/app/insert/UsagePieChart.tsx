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

interface Props {
  data: number[];
  init: number[];
}

type DataType = {
  date: string;
  cumulative: number;
};

const UsagePieChart = (props: Props) => {
  const [dataList, setDataList] = useState<DataType[]>(formatData(props.init));

  useEffect(() => {
    startTransition(() => {
      setDataList(formatData(props.data));
    });
  }, [props.data]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={dataList} margin={{ right: 30 }}>
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

function formatData(list: number[]) {
  const result: DataType[] = [];
  let cumulative = 0;
  list.forEach((item, index) => {
    cumulative += item;
    result.push({
      date: `${index + 1}日`,
      cumulative,
    });
  });
  return result;
}
