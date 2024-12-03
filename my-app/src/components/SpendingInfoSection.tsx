"use client";

import { Modal } from "@/components/Modal";
import { NewSpendingModal } from "@/composites/NewSpendingModal";
import { useSpendingInfo } from "@/context/SpendingInfoProvider";
import { normalizeNumber } from "@/utils/normalizeNumber";
import { useRef } from "react";

const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"];

export const SpendingInfoSection = () => {
  const { state } = useSpendingInfo();
  const modalRef = useRef<ModalRef>(null);
  const today = new Date();

  const handleOpenModal = () => {
    modalRef.current?.open();
  };

  return (
    <div className="flex flex-col w-full gap-3">
      {/* Title */}
      <div className="flex w-full items-center justify-center gap-1 py-6">
        <span className="text-2xl font-bold">
          {today.getMonth() + 1}/{today.getDate()}
        </span>
        <span className="text-2xl font-bold">
          (週{WEEKDAY[today.getDay()]})
        </span>
      </div>

      {/* Total Spending */}
      <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-solid border-text p-3">
        <span className="text-xl font-bold">Total</span>
        <span
          className={`text-xl font-bold ${state.total < 0 ? "text-red-500" : "text-green-500"}`}
        >
          {state.total}
        </span>
      </div>

      {/* Income & Outcome */}
      <div className="grid w-full grid-cols-2 gap-3">
        <div className="col-span-1 flex items-center justify-between gap-3 rounded-lg bg-green-300 p-3">
          <span className="text-lg">收入</span>
          <span className="text-lg">${normalizeNumber(state.income)}</span>
        </div>
        <div className="col-span-1 flex items-center justify-between gap-3 rounded-lg bg-red-300 p-3">
          <span className="text-lg">支出</span>
          <span className="text-lg">${normalizeNumber(state.outcome)}</span>
        </div>
      </div>

      {/* Add Record */}
      <div className="flex w-full items-center justify-center pt-12">
        <button
          type="button"
          onClick={handleOpenModal}
          className="px-6 py-3 border-b-2 border-dashed border-text text-xl font-semibold transition-all hover:text-blue-500 hover:shadow-[0_12px_12px_-12px_#1CB5D9] hover:border-blue-500"
        >
          新增
        </button>
      </div>

      <Modal ref={modalRef}>
        <NewSpendingModal />
      </Modal>
    </div>
  );
};
