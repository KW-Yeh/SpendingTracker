"use client";
import { Calculator } from "@/components/Calculator";
import { useState } from "react";

export const NewSpendingModal = () => {
  const [step, setStep] = useState(0);
  const [cost, setCost] = useState<number>();

  const handleNextStep = () => setStep((prev) => prev + 1);

  return (
    <div className="flex flex-col gap-3 p-1 w-full md:w-auto items-center">
      {step === 0 && (
        <Step1
          cost={cost}
          handleSetCost={setCost}
          handleNextStep={handleNextStep}
        />
      )}
    </div>
  );
};

const Step1 = ({
  cost,
  handleSetCost,
  handleNextStep,
}: {
  cost?: number;
  handleSetCost: (cost: number) => void;
  handleNextStep: () => void;
}) => {
  return (
    <>
      <h1 className="font-bold text-xl w-full text-start">How much?</h1>
      <Calculator initialNumber={cost} onResult={handleSetCost}>
        <button
          type="button"
          // onClick={handleNextStep}
          disabled={!cost}
          className="rounded-lg col-span-2 bg-primary-500 disabled:grayscale hover:enabled:bg-primary-300 transition-colors"
        >
          Next Step
        </button>
      </Calculator>
    </>
  );
};
