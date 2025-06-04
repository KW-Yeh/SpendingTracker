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
  className?: string;
}

export const YearMonthFilter = (props: Props) => {
  const { refreshData, group, dateOptions, className = '' } = props;
  const { today, setYear, year, setMonth, month } = dateOptions;

  useEffect(() => {
    refreshData(group?.id, year, month);
  }, [group?.id, year, month, refreshData]);

  return (
    <div
      className={`flex w-full items-center justify-center gap-2 ${className}`}
    >
      <div className="border-text w-30 rounded-lg border border-solid bg-background px-4 py-2">
        <Select
          name="year"
          caretStyle="rounded-full bg-text size-3 p-0.5 text-background"
          className="w-full"
          value={year}
          onChange={setYear}
        >
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

      <div className="border-text w-25 rounded-lg border border-solid bg-background px-4 py-2">
        <Select
          name="month"
          value={month}
          label={month.padStart(2, '0')}
          onChange={setMonth}
          className="w-full"
          caretStyle="rounded-full bg-text size-3 p-0.5 text-background"
        >
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Select.Item key={(i + 1).toString()} value={(i + 1).toString()}>
                {(i + 1).toString().padStart(2, '0')}
              </Select.Item>
            ))}
        </Select>
      </div>
    </div>
  );
};
