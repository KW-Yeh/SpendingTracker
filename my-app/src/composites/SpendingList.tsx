import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { deleteItem } from '@/services/dbHandler';
import { Necessity, SpendingType } from '@/utils/constants';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';

interface Props {
  date: Date;
  type: SpendingType;
  handleEdit: (record: SpendingRecord) => void;
}

export const SpendingList = (props: Props) => {
  const { loading, data } = useGetSpendingCtx();
  const { data: session } = useSession();
  const year = props.date.getFullYear();
  const month = props.date.getMonth();
  const day = props.date.getDate();

  const filteredData = useMemo(
    () =>
      [...data]
        .filter((data) => data.type === props.type)
        .sort((_, b) => {
          if (b.necessity === Necessity.Need) return 1;
          return -1;
        }),
    [data, props.type],
  );

  const totalAmount = filteredData.reduce(
    (acc, spending) => acc + spending.amount,
    0,
  );

  return (
    <div className="flex w-full max-w-175 flex-1 flex-col justify-end gap-2 text-xs sm:text-sm lg:text-base">
      {loading && (
        <div className="mb-2 flex w-full items-center justify-center pb-96">
          <span>Loading...</span>
        </div>
      )}
      {!loading && (
        <>
          <h3 className="">{`${year}/${month}/${day}: $${normalizeNumber(totalAmount)}`}</h3>
          <div className="scrollbar flex h-96 w-full flex-col overflow-y-auto overflow-x-hidden">
            {filteredData.map((spending, index) => (
              <Item
                key={`${spending.id}-${index.toString()}`}
                spending={spending}
                userToken={session?.user?.email ?? ''}
                handleEdit={props.handleEdit}
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
  userToken,
  handleEdit,
}: {
  spending: SpendingRecord;
  userToken: string;
  handleEdit: (record: SpendingRecord) => void;
}) => {
  const { syncData } = useGetSpendingCtx();

  const handleOnEdit = () => {
    handleEdit(spending);
  };

  const handleOnDelete = useCallback(() => {
    if (!confirm('確定要刪除這筆資料嗎?')) return;
    deleteItem(spending.id).then(() => {
      syncData(userToken);
    });
  }, [spending.id, userToken, syncData]);

  return (
    <div className="grid grid-cols-12 items-center gap-2 rounded p-2 odd:bg-gray-200">
      <div className="col-span-1 text-center">{spending.necessity}</div>
      <div className="col-span-1 flex items-center justify-center">
        <div className="rounded border border-solid border-text p-1">
          {spending.category}
        </div>
      </div>
      <div
        title={spending.description}
        className="col-span-5 overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {spending.description}
      </div>
      <div className="col-span-2 text-end">
        ${normalizeNumber(spending.amount)}
      </div>
      <div className="col-span-3 flex items-center justify-end gap-px">
        <button
          onClick={handleOnEdit}
          className="group rounded p-2 transition-colors hover:bg-primary-300"
        >
          <EditIcon className="size-4 transition-colors group-hover:text-background" />
        </button>
        <button
          onClick={handleOnDelete}
          className="group rounded p-2 transition-colors hover:bg-red-300"
        >
          <DeleteIcon className="size-4 transition-colors group-hover:text-background" />
        </button>
      </div>
    </div>
  );
};
