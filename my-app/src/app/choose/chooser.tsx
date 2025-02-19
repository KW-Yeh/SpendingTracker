'use client';

import { CloseIcon } from '@/components/icons/CloseIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { RefreshIcon } from '@/components/icons/RefreshIcon';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { useCallback, useMemo, useRef, useState } from 'react';
import { v7 as uuid } from 'uuid';

type Constraint = {
  uid: string;
  target: Choice;
  reason: string;
  affect: number;
};

enum Choice {
  Left = 'left',
  Right = 'right',
}

export const Chooser = () => {
  const [choice1, setChoice1] = useState<string>('選擇一');
  const [choice2, setChoice2] = useState<string>('選擇二');
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [percentage, setPercentage] = useState<number>(50);
  const [selectedConstraintId, setSelectedConstraintId] = useState<string>();
  const modalRef = useRef<ModalRef>(null);

  const handleResetConstraints = () => {
    setConstraints([]);
    setPercentage(50);
    setSelectedConstraintId(undefined);
  };

  const handleEditConstraint = (uid: string) => {
    setSelectedConstraintId(uid);
    modalRef.current?.open();
  };

  const handleDeleteConstraint = (uid: string) => {
    setConstraints((prevState) => {
      const matched = prevState.find((c) => c.uid === uid);
      if (matched && matched.target === Choice.Left) {
        console.log('affect to delete ', choice1, matched.affect);
        setPercentage((prevState) => prevState - matched.affect);
      } else if (matched && matched.target === Choice.Right) {
        console.log('affect to delete ', choice2, matched.affect);
        setPercentage((prevState) => prevState + matched.affect);
      }
      return prevState.filter((c) => c.uid !== uid);
    });
  };

  const selectedConstraint = useMemo(
    () => constraints.find((c) => c.uid === selectedConstraintId),
    [constraints, selectedConstraintId],
  );

  const handleOnUpdateConstraint = useCallback(
    (constraint: Constraint) => {
      if (selectedConstraintId) {
        const matched = constraints.findIndex(
          (c) => c.uid === selectedConstraintId,
        );
        if (matched !== -1) {
          setConstraints((prevState) => {
            const newState = [...prevState];
            if (constraint.target === Choice.Left) {
              console.log('affect to old ', choice1, constraint.affect);
              setPercentage(
                (prevState) =>
                  prevState - newState[matched].affect + constraint.affect,
              );
            } else if (constraint.target === Choice.Right) {
              console.log('affect to old ', choice2, constraint.affect);
              setPercentage(
                (prevState) =>
                  prevState + newState[matched].affect - constraint.affect,
              );
            }
            newState[matched] = constraint;
            return newState;
          });
          setSelectedConstraintId(undefined);
        }
      } else {
        setConstraints((prevState) => {
          return [...prevState, constraint];
        });
        if (constraint.target === Choice.Left) {
          console.log('affect to new ', choice1, constraint.affect);
          setPercentage((prevState) => prevState + constraint.affect);
        } else if (constraint.target === Choice.Right) {
          console.log('affect to new ', choice2, constraint.affect);
          setPercentage((prevState) => prevState - constraint.affect);
        }
      }
    },
    [choice1, choice2, constraints, selectedConstraintId],
  );

  return (
    <div className="relative flex w-full flex-1 flex-col items-center gap-4 p-6">
      <div className="absolute right-6 top-6">
        <button
          type="button"
          onClick={handleResetConstraints}
          className="rounded-md bg-gray-200 p-2 transition-colors active:bg-gray-300 sm:hover:bg-gray-300"
        >
          <RefreshIcon className="size-4" />
        </button>
      </div>
      <div className="mt-10 flex w-full max-w-175 flex-col gap-2">
        <div className="flex w-full items-center justify-between gap-4">
          <button
            type="button"
            name="choice1"
            title={choice1}
            onClick={() => {
              const value = prompt('請輸入選項一');
              if (value && value !== '') {
                setChoice1(value);
              }
            }}
            className="w-full max-w-48 overflow-hidden text-ellipsis text-balance rounded-md border-2 border-solid border-gray-300 px-2 py-1 text-center font-bold transition-colors active:border-gray-300 sm:hover:border-gray-500"
          >
            {choice1}
          </button>
          <button
            type="button"
            name="choice2"
            title={choice2}
            onClick={() => {
              const value = prompt('請輸入選項二');
              if (value && value !== '') {
                setChoice2(value);
              }
            }}
            className="w-full max-w-48 overflow-hidden text-ellipsis text-balance rounded-md border-2 border-solid border-gray-300 px-2 py-1 text-center font-bold transition-colors active:border-gray-300 sm:hover:border-gray-500"
          >
            {choice2}
          </button>
        </div>
        <div className="w-ful flex items-center gap-2">
          <span className="w-20 text-center text-xl font-black">
            {percentage}%
          </span>
          <div className="flex flex-1 items-center">
            <span
              className="h-1 rounded-l-full bg-primary-500"
              style={{
                width: `${percentage}%`,
              }}
            ></span>
            <span
              className="h-1 rounded-r-full bg-red-500"
              style={{
                width: `${100 - percentage}%`,
              }}
            ></span>
          </div>
          <span className="w-20 text-center text-xl font-black">
            {100 - percentage}%
          </span>
        </div>
        <div className="mt-8 flex w-full flex-col items-center">
          <h2 className="text-lg font-bold">設立條件</h2>
          <div className="flex w-full flex-col gap-2 py-2">
            {constraints.map((constraint) => (
              <div
                key={constraint.uid}
                className="flex w-full items-center gap-2"
              >
                <div className="flex flex-1 flex-col gap-2 rounded-md border border-solid border-gray-300 p-2 transition-colors active:border-gray-500 active:bg-gray-300 sm:flex-row sm:items-center sm:hover:border-gray-500 sm:hover:bg-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 whitespace-nowrap text-sm text-gray-500">
                      讓我猶豫
                    </span>
                    <span className="border-b border-solid border-text font-semibold">
                      {constraint.target === Choice.Left
                        ? '左邊選項'
                        : '右邊選項'}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-sm text-gray-500">
                      的原因是
                    </span>
                  </div>
                  <span
                    title={constraint.reason}
                    className="max-w-64 flex-1 overflow-hidden text-ellipsis border-b border-solid border-text font-semibold"
                  >
                    {constraint.reason}
                  </span>
                  <div className="flex flex-1 items-center gap-2 sm:justify-end">
                    <span className="shrink-0 whitespace-nowrap text-sm text-gray-500">
                      大概有
                    </span>
                    <span>{constraint.affect}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleEditConstraint(constraint.uid)}
                    className="group shrink-0 rounded p-2 transition-colors active:bg-primary-500 sm:hover:bg-primary-500"
                  >
                    <EditIcon className="size-4 transition-colors group-active:text-background sm:group-hover:text-background" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteConstraint(constraint.uid)}
                    className="group shrink-0 rounded p-2 transition-colors active:bg-red-500 sm:hover:bg-red-500"
                  >
                    <CloseIcon className="size-4 transition-colors group-active:text-background sm:group-hover:text-background" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setSelectedConstraintId(undefined);
          modalRef.current?.open();
        }}
        className="fixed bottom-8 z-30 mx-auto flex w-40 items-center justify-center rounded-full border border-solid border-text p-4 shadow-md transition-all active:scale-105 sm:hover:scale-105"
      >
        <span className="font-bold">新增條件</span>
      </button>

      <Modal
        ref={modalRef}
        onClose={() => modalRef.current?.close()}
        title={selectedConstraintId ? '編輯條件' : '新增條件'}
        className="flex w-full max-w-96 flex-col gap-4"
      >
        <ChoiceModal
          choice1={choice1}
          choice2={choice2}
          selected={selectedConstraint}
          onClose={() => modalRef.current?.close()}
          onSubmit={handleOnUpdateConstraint}
        />
      </Modal>
    </div>
  );
};

interface ChoiceModalProps {
  choice1: string;
  choice2: string;
  selected?: Constraint;
  onClose: () => void;
  onSubmit: (constraint: Constraint) => void;
}

const ChoiceModal = (props: ChoiceModalProps) => {
  const { choice1, choice2, selected, onClose, onSubmit } = props;
  const [selectedChoice, setSelectedChoice] = useState<Choice>(Choice.Left);
  const [reason, setReason] = useState<string>(selected?.reason ?? '');
  const [score, setScore] = useState<number>(selected?.affect ?? 0);

  const handleSubmit = useCallback(() => {
    onSubmit({
      uid: selected?.uid ?? uuid(),
      target: selectedChoice,
      reason: reason || '沒有理由',
      affect: score,
    });
    onClose();
  }, [onClose, onSubmit, reason, score, selected?.uid, selectedChoice]);

  return (
    <>
      <div className="flex w-full items-center gap-4">
        <span className="shrink-0 whitespace-nowrap text-sm text-gray-500">
          對於選擇
        </span>
        <div className="max-w-60 flex-1">
          <Select
            name="choice"
            value={selectedChoice === Choice.Left ? choice1 : choice2}
            onChange={(value) => setSelectedChoice(value as Choice)}
            className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1 transition-colors active:border-text sm:hover:border-text"
          >
            <Select.Item value={Choice.Left}>{choice1}</Select.Item>
            <Select.Item value={Choice.Right}>{choice2}</Select.Item>
          </Select>
        </div>
      </div>
      <div className="flex w-full items-center gap-4">
        <span className="shrink-0 whitespace-nowrap text-sm text-gray-500">
          大概有
        </span>
        <div className="w-20">
          <Select
            name="choice"
            value={score.toString() + '%'}
            onChange={(value) => setScore(Number(value))}
            className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1 transition-colors active:border-text sm:hover:border-text"
          >
            {Array(11)
              .fill(0)
              .map((_, index) => (
                <Select.Item
                  key={`${index * 10}%`}
                  value={(index * 10).toString()}
                >
                  {index * 10}%
                </Select.Item>
              ))}
          </Select>
        </div>
        <span className="shrink-0 whitespace-nowrap text-sm text-gray-500">
          意願
        </span>
      </div>
      <div className="flex w-full items-center gap-2">
        <span className="shrink-0 whitespace-nowrap text-sm text-gray-500">
          因為
        </span>
        <fieldset className="flex h-10 flex-1 items-center rounded-md border border-solid border-gray-300 px-2 py-1">
          <input
            type="text"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
            }}
            className="w-full bg-transparent focus:outline-0"
          />
        </fieldset>
      </div>
      <div className="mt-6 flex w-full flex-1 items-end justify-between py-2">
        <button
          type="button"
          onClick={onClose}
          className="flex w-24 items-center justify-center rounded-lg border border-solid border-red-300 bg-background p-2 text-red-300 transition-colors active:border-red-500 active:text-red-500 sm:hover:border-red-500 sm:hover:text-red-500"
        >
          <span>取消</span>
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex w-36 items-center justify-center rounded-lg border border-solid border-text bg-text p-2 text-background transition-all active:bg-gray-600 sm:hover:bg-gray-600"
        >
          <span>送出</span>
        </button>
      </div>
    </>
  );
};
