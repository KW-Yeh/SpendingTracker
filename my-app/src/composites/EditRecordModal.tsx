'use client';

import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditExpenseModal } from './EditExpenseModal';
import { useSpendingReducer } from '@/hooks/useSpendingReducer';
import { v7 as uuid } from 'uuid';
import { usePrepareData } from '@/hooks/usePrepareData';

const EditRecordModal = ({ recordId }: { recordId: string }) => {
  const modalRef = useRef<ModalRef>(null);
  const router = useRouter();
  const [state, dispatch] = useSpendingReducer();
  usePrepareData();
  const { data } = useGetSpendingCtx();
  const [isMatched, setIsMatched] = useState(false);

  const reset = () => {
    dispatch({
      type: 'RESET',
      payload: {
        id: uuid(),
        date: new Date().toUTCString(),
        amount: 0,
        description: '',
      },
    });
  };

  useEffect(() => {
    if (data.length > 0) {
      const matched = data.find((record) => record.id === recordId);
      setIsMatched(matched !== undefined);
      if (matched) {
        dispatch({
          type: 'RESET',
          payload: matched,
        });
      } else {
        reset();
      }
      modalRef.current?.open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, recordId, dispatch]);

  return (
    <EditExpenseModal
      ref={modalRef}
      data={state}
      isNewData={!isMatched}
      reset={reset}
      onClose={router.back}
    />
  );
};

export default EditRecordModal;
