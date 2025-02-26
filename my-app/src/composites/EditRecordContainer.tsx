'use client';

import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { usePrepareData } from '@/hooks/usePrepareData';
import { useSpendingReducer } from '@/hooks/useSpendingReducer';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v7 as uuid } from 'uuid';
import { EditExpenseModal } from './EditExpenseModal';

const EditRecordContainer = ({ recordId }: { recordId?: string | null }) => {
  const modalRef = useRef<ModalRef>(null);
  const router = useRouter();
  const [state, dispatch] = useSpendingReducer();
  usePrepareData();
  const { data } = useGetSpendingCtx();
  const [isMatched, setIsMatched] = useState(false);

  const reset = useCallback(() => {
    dispatch({
      type: 'RESET',
      payload: {
        id: uuid(),
        date: new Date().toUTCString(),
        amount: 0,
        description: '',
      },
    });
  }, [dispatch]);

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
        dispatch({
          type: 'RESET',
          payload: {
            id: uuid(),
            date: new Date().toUTCString(),
            amount: 0,
            description: '',
          },
        });
      }
      modalRef.current?.open();
    }
  }, [recordId, dispatch, data]);

  return (
    <EditExpenseModal
      ref={modalRef}
      data={state}
      isNewData={!isMatched}
      reset={reset}
      onClose={() => router.push('/insert')}
    />
  );
};

export default EditRecordContainer;
