'use client';

import { YearMonthFilter } from '@/app/analysis/YearMonthFilter';
import { GroupSelector } from '@/composites/GroupSelector';

interface Props {
  dateOptions: {
    today: Date;
    year: string;
    setYear: (year: string) => void;
    month: string;
    setMonth: (month: string) => void;
  };
  refreshData?: (
    groupId: string | undefined,
    year: string,
    month: string,
  ) => void;
  group?: Group;
  className?: string;
}

/**
 * 帳本 + 月份合併成一條控制列：兩者都是「看哪個範圍」的選擇，
 * 分散在 header 與頁面上方會多佔一整列高度。
 */
export const PageControlBar = ({
  dateOptions,
  refreshData,
  group,
  className = '',
}: Props) => (
  <div className={`flex w-full items-center gap-2 ${className}`}>
    <div className="max-w-56 min-w-0 flex-1 md:max-w-72">
      <GroupSelector variant="pill" />
    </div>
    <YearMonthFilter
      compact
      dateOptions={dateOptions}
      refreshData={refreshData}
      group={group}
      className="ml-auto shrink-0"
    />
  </div>
);
