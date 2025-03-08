'use client';

import { startTransition, useEffect, useState } from 'react';
import { Label, Pie, PieChart } from 'recharts';

interface Props {
  width: number;
  height: number;
  budget: number;
  usage: number;
}

const UsagePieChart = (props: Props) => {
  const [budget, setBudget] = useState(100);
  const [usage, setUsage] = useState(0);
  const [percentage, setPercentage] = useState('0');

  useEffect(() => {
    startTransition(() => {
      const newBudget = props.budget !== 0 ? props.budget : props.usage;
      setBudget(newBudget);
      setUsage(props.usage);
      setPercentage(((props.usage * 100) / newBudget).toFixed(0));
    });
  }, [props.budget, props.usage]);

  return (
    <PieChart width={props.width} height={props.height}>
      <Pie
        dataKey="value"
        data={[
          {
            name: '已使用',
            value: usage,
            fill: '#7B56E17F',
          },
          {
            name: '剩餘',
            value: budget - usage,
            fill: '#D1D5DB80',
          },
        ]}
        innerRadius={30}
        outerRadius={40}
        strokeOpacity={0}
      >
        <Label
          value={`${percentage}%`}
          offset={0}
          position="center"
          className="text-sm font-bold"
        />
      </Pie>
    </PieChart>
  );
};

export default UsagePieChart;
