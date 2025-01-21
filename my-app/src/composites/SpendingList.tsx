import { CloseIcon } from '@/components/icons/CloseIcon';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { deleteItem } from '@/services/dbHandler';
import { Necessity, SpendingType } from '@/utils/constants';
import { formatDate } from '@/utils/formatDate';
import { normalizeNumber } from '@/utils/normalizeNumber';
import {
  MouseEvent,
  ReactNode,
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
  reset: () => void;
}

enum FilterType {
  Today,
  ThisMonth,
}

export const SpendingList = (props: Props) => {
  const { date, type, selectedDataId, memberEmail, handleEdit, reset } = props;
  const { loading, data } = useGetSpendingCtx();
  const [filter, setFilter] = useState(FilterType.Today);
  const [filteredData, setFilteredData] = useState<SpendingRecord[]>([]);
  const isInited = useRef(false);
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

  const surplus = useMemo(
    () =>
      [...data].reduce(
        (acc, spending) =>
          spending.type === SpendingType.Income
            ? acc + spending.amount
            : acc - spending.amount,
        0,
      ),
    [data],
  );

  useEffect(() => {
    if (!loading && !isInited.current) {
      isInited.current = true;
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
      {!isInited.current && (
        <div className="mb-2 flex w-full items-center justify-center pb-80">
          <span>Loading...</span>
        </div>
      )}
      {isInited.current && (
        <>
          <div className="flex w-full items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <FilterBtn
                selected={filter === FilterType.Today}
                onClick={() => setFilter(FilterType.Today)}
              >
                {`當日 (${month + 1}/${day})`}
              </FilterBtn>
              <FilterBtn
                selected={filter === FilterType.ThisMonth}
                onClick={() => setFilter(FilterType.ThisMonth)}
              >
                {`當月 (盈餘 $${normalizeNumber(surplus)})`}
              </FilterBtn>
            </div>
            <span>{`總共: $${normalizeNumber(totalAmount)}`}</span>
          </div>
          <div className="scrollbar flex h-80 w-full flex-col gap-1 overflow-y-auto overflow-x-hidden px-1 py-2">
            {filteredData.map((spending, index) => (
              <Item
                key={`${spending.id}-${index.toString()}`}
                spending={spending}
                id={selectedDataId}
                handleEdit={handleEdit}
                reset={reset}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const FilterBtn = ({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected: boolean;
  onClick: (event: MouseEvent) => void;
}) => {
  return (
    <button
      type="button"
      className={`rounded border border-solid px-2 py-1 transition-colors ${selected ? 'border-text bg-primary-100 text-black' : 'border-gray-300 active:border-text sm:hover:border-text'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Item = ({
  spending,
  id,
  handleEdit,
  reset,
}: {
  spending: SpendingRecord;
  id: string;
  handleEdit: (record: SpendingRecord) => void;
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
      requestAnimationFrame(() => {
        setDeleting(false);
      });
    });
  }, [spending.id]);

  return (
    <div
      className={`relative grid grid-cols-12 items-center gap-2 rounded border-l-4 border-solid p-2 transition-all odd:bg-gray-100 ${spending.necessity === Necessity.NotNeed ? 'border-gray-300' : 'border-orange-300'} ${additionalStyle}`}
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
      <div className="col-span-2 text-center text-xs sm:col-span-1 sm:text-sm">
        {formatDate(spending.date)}
      </div>
      <div className="col-span-1 flex items-center justify-center">
        <div className="rounded border border-solid border-text p-1">
          {spending.category}
        </div>
      </div>
      <div
        title={spending.description}
        className="col-span-4 overflow-hidden text-ellipsis whitespace-nowrap sm:col-span-5"
      >
        {spending.description}
      </div>
      <div className="col-span-2 text-end">
        ${normalizeNumber(spending.amount)}
      </div>
      <div className="col-span-3 flex items-center justify-end gap-px">
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
