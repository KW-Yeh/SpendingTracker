"use client";

import { useSpendingInfo } from "@/context/SpendingInfoProvider";
import { normalizeNumber } from "@/utils/normalizeNumber";

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const SpendingInfoSection = () => {
  const { state } = useSpendingInfo();
  const today = new Date();

  return (
    <div className="flex flex-col w-full gap-3">
      {/* Title */}
      <div className="flex w-full items-center justify-center gap-1 py-6">
        <span className="text-2xl font-bold">
          {today.getMonth() + 1}/{today.getDate()}
        </span>
        <span className="text-2xl font-bold">({WEEKDAY[today.getDay()]})</span>
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
          <span className="text-lg">Income</span>
          <span className="text-lg">${normalizeNumber(state.income)}</span>
        </div>
        <div className="col-span-1 flex items-center justify-between gap-3 rounded-lg bg-red-300 p-3">
          <span className="text-lg">Outcome</span>
          <span className="text-lg">${normalizeNumber(state.outcome)}</span>
        </div>
      </div>

      {/* Add Record */}
      <div className="flex w-full items-center justify-center pt-12">
        <button className="px-6 py-3 border-2 border-dashed border-text text-xl font-semibold transition-all rounded-lg hover:border-2 hover:border-solid hover:text-blue-500 hover:shadow-blue-300 hover:shadow-lg hover:border-blue-500">
          Add Record
        </button>
      </div>
    </div>
  );
};
