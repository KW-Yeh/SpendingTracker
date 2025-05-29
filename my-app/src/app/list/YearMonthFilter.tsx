import { Select } from '@/components/Select';
import { useEffect } from 'react';

interface Props {
  refreshData: (
    groupId: string | undefined,
    year: string,
    month: string,
  ) => void;
  group?: Group;
  dateOptions: {
    today: Date;
    year: string;
    setYear: (year: string) => void;
    month: string;
    setMonth: (month: string) => void;
  };
}

export const YearMonthFilter = (props: Props) => {
  const { refreshData, group, dateOptions } = props;
  const { today, setYear, year, setMonth, month } = dateOptions;

  useEffect(() => {
    refreshData(group?.id, year, month);
  }, [group?.id, year, month, refreshData]);

  return (
    <div className="bg-background flex w-full items-center justify-center gap-2 rounded-full border border-solid border-gray-300 px-4 py-1">
      <div className="w-12">
        <Select name="year" value={year} onChange={setYear}>
          {Array(11)
            .fill(0)
            .map((_, i) => (
              <Select.Item
                key={`${today.getFullYear() - 5 + i}`}
                value={`${today.getFullYear() - 5 + i}`}
              >
                {`${today.getFullYear() - 5 + i}`}
              </Select.Item>
            ))}
        </Select>
      </div>
      <span>年</span>
      <div className="w-10">
        <Select
          name="month"
          value={month}
          onChange={setMonth}
          className="w-full"
        >
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Select.Item key={(i + 1).toString()} value={(i + 1).toString()}>
                {i + 1}
              </Select.Item>
            ))}
        </Select>
      </div>
      <span>月</span>
    </div>
  );
};
