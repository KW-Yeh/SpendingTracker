'use client';

import { CollaborateRecordList } from './CollaborateRecordList';
import { GroupManagement } from './GroupManagement';
import AddExpenseBtn from '@/app/insert/AddExpenseBtn';
import { DailyCostChart } from '@/app/insert/DailyCostChart';
import { YearMonthFilter } from '@/app/list/YearMonthFilter';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useYearMonth } from '@/hooks/useYearMonth';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { MOCK_SPENDING_RECORDS, USE_MOCK_DATA } from '@/utils/mockData';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CategoricalChartState } from 'recharts/types/chart/types';

export const CollaborateSection = ({ isMobile }: { isMobile: boolean }) => {
  useScrollToTop();
  const { config: userData } = useUserConfigCtx();
  const { syncData, data, loading } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const [isProcessing, setIsProcessing] = useState(true);
  const [monthlyData, setMonthlyData] = useState<SpendingRecord[]>([]);
  const [filterStr, setFilterStr] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const dateHook = useYearMonth(new Date());

  // 使用測試資料或真實資料
  const displayData = useMemo(
    () =>
      USE_MOCK_DATA && currentGroup
        ? MOCK_SPENDING_RECORDS.filter(
            (record) => record.groupId === currentGroup.id,
          )
        : data,
    [currentGroup, data],
  );

  const refreshData = useCallback(
    (_groupId?: string) => {
      if (!_groupId) return;
      const { startDate, endDate } = getStartEndOfMonth(
        new Date(Number(dateHook.year), Number(dateHook.month) - 1),
      );
      syncData(
        _groupId,
        undefined, // 不限制使用者，顯示群組內所有人的記錄
        startDate.toISOString(),
        endDate.toISOString(),
      );
    },
    [syncData, dateHook.year, dateHook.month],
  );

  const getNewData = useCallback(
    (_groupId: string | undefined, year: string, month: string) => {
      if (!_groupId) return;
      const { startDate, endDate } = getStartEndOfMonth(
        new Date(Number(year), Number(month) - 1),
      );
      syncData(
        _groupId,
        undefined, // 不限制使用者，顯示群組內所有人的記錄
        startDate.toISOString(),
        endDate.toISOString(),
      );
    },
    [syncData],
  );

  const handleSelectDataPoint = (state: CategoricalChartState) => {
    if (!state.activePayload?.[0]) return;
    const selectedLabel = state.activePayload[0].payload.date;
    if (!selectedLabel) return;
    const element = document.getElementById(`spending-list-${selectedLabel}`);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.style.borderColor = '#fff085';
    setTimeout(() => {
      element.style.borderColor = 'transparent';
    }, 2000);
  };

  useEffect(() => {
    startTransition(() => {
      if (loading && !USE_MOCK_DATA) return;
      // 在協作記帳中顯示所有群組成員的記錄
      setMonthlyData([...displayData]);
      startTransition(() => {
        setIsProcessing(false);
      });
    });
  }, [displayData, loading]);

  useEffect(() => {
    const elem = searchRef.current;
    const handleOnChangeSearch = () => {
      setFilterStr(elem?.value || '');
    };
    elem?.addEventListener('change', handleOnChangeSearch);
    return () => elem?.removeEventListener('change', handleOnChangeSearch);
  }, []);

  useEffect(() => {
    if (currentGroup?.id) {
      const { startDate, endDate } = getStartEndOfMonth(
        new Date(Number(dateHook.year), Number(dateHook.month) - 1),
      );
      syncData(
        currentGroup.id,
        undefined, // 不限制使用者
        startDate.toISOString(),
        endDate.toISOString(),
      );
    }
  }, [currentGroup?.id, dateHook.month, dateHook.year, syncData]);

  return (
    <div className="content-wrapper">
      {/* 群組管理區塊 */}
      <GroupManagement />

      {/* 當有選擇群組時才顯示記帳內容 */}
      {currentGroup ? (
        <>
          <YearMonthFilter
            refreshData={getNewData}
            group={currentGroup}
            dateOptions={dateHook}
            className="flex self-center rounded-lg border border-gray-200 bg-white p-2 text-base shadow-sm"
          />

          <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
            <div className="flex w-full max-w-175 flex-col items-center gap-5">
              {/* 新增記帳按鈕 */}
              <AddExpenseBtn className="w-full">新增共同記帳</AddExpenseBtn>

              {/* 日常支出圖表 */}
              <DailyCostChart
                dateStr={dateHook.today.toISOString()}
                costList={displayData}
                isMobile={isMobile}
                handleSelectDataPoint={handleSelectDataPoint}
              />
            </div>

            {/* 記帳列表 */}
            <div className="bg-background flex w-full flex-col rounded-2xl border border-solid border-gray-200 p-5 shadow-sm transition-shadow duration-200 hover:shadow">
              <div className="mb-5 flex items-center gap-4">
                <h3 className="text-lg font-bold">共同記帳帳目</h3>
                <div className="group hover:border-primary-400 focus-within:border-primary-500 relative ml-auto flex items-center gap-2 rounded-lg border border-solid border-gray-300 px-3 py-1.5 transition-all focus-within:shadow-sm">
                  <SearchIcon className="group-hover:text-primary-500 group-focus-within:text-primary-500 text-gray-500 transition-colors" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="搜尋帳目..."
                    className="w-32 bg-transparent py-0.5 text-sm font-medium focus:outline-0"
                  />
                </div>
              </div>
              <CollaborateRecordList
                data={monthlyData}
                filterStr={filterStr}
                loading={isProcessing}
                refreshData={refreshData}
                currentUserEmail={userData?.email}
                groupMembers={currentGroup.users}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-4 py-20">
          <p className="text-lg text-gray-500">
            請先選擇或創建一個群組以開始協作記帳
          </p>
        </div>
      )}
    </div>
  );
};
