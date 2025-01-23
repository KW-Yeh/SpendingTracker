import { CloseIcon } from '@/components/icons/CloseIcon';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { Select } from '@/components/Select';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { deleteItem } from '@/services/dbHandler';
import { Necessity, SpendingType } from '@/utils/constants';
import { formatDate } from '@/utils/formatDate';
import { normalizeNumber } from '@/utils/normalizeNumber';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface Props {
  date: Date;
  type: SpendingType;
  selectedDataId: string;
  handleEdit: (record: SpendingRecord) => void;
  memberEmail?: string;
  refreshData: () => void;
  reset: () => void;
}

enum FilterType {
  Today,
  ThisMonth,
}

export const SpendingList = (props: Props) => {
  const {
    date,
    type,
    selectedDataId,
    memberEmail,
    handleEdit,
    refreshData,
    reset,
  } = props;
  const { loading, data } = useGetSpendingCtx();
  const [filter, setFilter] = useState(FilterType.Today);
  const [filteredData, setFilteredData] = useState<SpendingRecord[]>([]);
  const isInitialized = useRef(false);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const checkDate = useCallback(
    (dateStr: string) => {
      const date = new Date(dateStr);
      if (filter === FilterType.ThisMonth) {
        return date.getFullYear() === year && date.getMonth() === month;
      }
      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    },
    [day, month, year, filter],
  );

  const totalAmount = filteredData.reduce(
    (acc, spending) => acc + spending.amount,
    0,
  );

  const today = useMemo(() => `當天 ${month + 1}/${day}`, [day, month]);
  const thisMonth = useMemo(() => `當月 ${month + 1}月`, [month]);

  useEffect(() => {
    if (!loading && !isInitialized.current) {
      isInitialized.current = true;
    }
    setFilteredData(
      [...data].filter(
        (data) =>
          (memberEmail === '' || data['user-token'] === memberEmail) &&
          data.type === type &&
          checkDate(data.date),
      ),
    );
  }, [loading, memberEmail, checkDate, data, type]);

  return (
    <div className="flex w-full max-w-175 flex-1 flex-col justify-end gap-2 text-xs sm:text-sm lg:text-base">
      {!isInitialized.current && (
        <div className="mb-2 flex w-full items-center justify-center pb-80">
          <span>Loading...</span>
        </div>
      )}
      {isInitialized.current && (
        <>
          <div className="flex w-full items-end justify-between px-1">
            <Select
              name="filter"
              className="rounded-full border border-solid px-3 py-1 transition-colors active:border-text sm:hover:border-text"
              value={filter === FilterType.Today ? today : thisMonth}
              onChange={(value) => setFilter(Number(value))}
            >
              <Select.Item value={FilterType.Today.toString()}>
                {today}
              </Select.Item>
              <Select.Item value={FilterType.ThisMonth.toString()}>
                {thisMonth}
              </Select.Item>
            </Select>
            <span className="text-gray-500">{`總共: $${normalizeNumber(totalAmount)}`}</span>
          </div>
          <div className="scrollbar flex h-80 w-full flex-col gap-1 overflow-y-auto overflow-x-hidden px-1 py-2">
            {filteredData.map((spending, index) => (
              <Item
                key={`${spending.id}-${index.toString()}`}
                spending={spending}
                id={selectedDataId}
                handleEdit={handleEdit}
                refreshData={refreshData}
                reset={reset}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Item = ({
  spending,
  id,
  handleEdit,
  refreshData,
  reset,
}: {
  spending: SpendingRecord;
  id: string;
  handleEdit: (record: SpendingRecord) => void;
  refreshData: () => void;
  reset: () => void;
}) => {
  const [deleting, setDeleting] = useState(false);
  const handleOnEdit = () => {
    handleEdit(spending);
  };

  const isSelected = useMemo(() => id === spending.id, [id, spending.id]);

  const additionalStyle = useMemo(() => {
    if (deleting) {
      return 'border-transparent shadow-[0_0_0_2px_#fca5a5]';
    } else if (isSelected) {
      return 'border-transparent shadow-[0_0_0_2px_#fde047]';
    }
    return 'active:bg-gray-200 sm:hover:bg-gray-200';
  }, [deleting, isSelected]);

  const handleOnDelete = useCallback(() => {
    if (!confirm('確定要刪除這筆資料嗎?')) return;
    setDeleting(true);
    deleteItem(spending.id).then(() => {
      startTransition(() => {
        setDeleting(false);
        refreshData();
      });
    });
  }, [refreshData, spending.id]);

  return (
    <div
      className={`relative flex items-center gap-2 rounded border-l-4 border-solid p-2 transition-all odd:bg-gray-100 ${spending.necessity === Necessity.NotNeed ? 'border-gray-300' : 'border-orange-300'} ${additionalStyle}`}
    >
      {deleting ? (
        <span className="absolute left-1 top-0 -translate-y-1/2 rounded-full bg-red-300 px-2 text-xs font-bold">
          刪除中
        </span>
      ) : (
        isSelected && (
          <span className="absolute left-1 top-0 -translate-y-1/2 rounded-full bg-yellow-300 px-2 text-xs font-bold">
            編輯中
          </span>
        )
      )}
      <div className="w-8 text-center text-xs sm:col-span-1 sm:text-sm">
        {formatDate(spending.date)}
      </div>
      <div className="flex w-7 items-center justify-center">
        <div className="rounded border border-solid border-text p-1">
          {spending.category}
        </div>
      </div>
      <div
        title={spending.description}
        className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap sm:col-span-5"
      >
        {spending.description}
      </div>
      <div className="w-fit text-end">${normalizeNumber(spending.amount)}</div>
      <div className="flex w-16 items-center justify-end">
        {isSelected ? (
          <button
            onClick={reset}
            className="group rounded p-2 transition-colors active:bg-primary-300 sm:hover:bg-primary-300"
          >
            <CloseIcon className="size-4 transition-colors group-active:text-background sm:group-hover:text-background" />
          </button>
        ) : (
          <button
            onClick={handleOnEdit}
            className="group rounded p-2 transition-colors active:bg-primary-300 sm:hover:bg-primary-300"
          >
            <EditIcon className="size-4 transition-colors group-active:text-background sm:group-hover:text-background" />
          </button>
        )}
        <button
          onClick={handleOnDelete}
          className="group rounded p-2 transition-colors active:bg-red-300 sm:hover:bg-red-300"
        >
          <DeleteIcon className="size-4 transition-colors group-active:text-background sm:group-hover:text-background" />
        </button>
      </div>
    </div>
  );
};
