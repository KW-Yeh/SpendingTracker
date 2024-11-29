"use client";
import {
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  useCallback,
  useState,
} from "react";

interface Props {
  initialNumber?: number;
  onResult: (result: number) => void;
  children: ReactNode;
}

export const Calculator = (props: Props) => {
  const { initialNumber = 0, onResult, children } = props;
  const [display, setDisplay] = useState<string>(initialNumber.toString());

  const handleButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const value = event.currentTarget.getAttribute("data-value") ?? "";
      if (value === "C") {
        setDisplay("");
        onResult(0);
      } else if (value === "DEL") {
        const newValue = display.slice(0, -1);
        setDisplay(newValue);
        onResult(Number(newValue));
      } else {
        if (display.length === 1 && display === "0") {
          setDisplay(value);
          onResult(Number(value));
        } else {
          const newValue = display + value;
          setDisplay(newValue);
          onResult(Number(newValue));
        }
      }
    },
    [display, onResult],
  );

  return (
    <div className="flex flex-col gap-2 w-fit">
      <div className="rounded-lg p-4 font-semibold flex items-center justify-end border-text border-2 border-solid">
        <span>{display}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button
          data-value="C"
          className="col-span-2"
          onClick={handleButtonClick}
        >
          All Clear
        </Button>
        <Button
          data-value="DEL"
          className="col-span-1"
          onClick={handleButtonClick}
        >
          DEL
        </Button>
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"].map((btn) => (
          <Button
            key={btn}
            data-value={btn}
            className="col-span-1 size-14"
            onClick={handleButtonClick}
          >
            {btn}
          </Button>
        ))}
        {children}
      </div>
    </div>
  );
};

const Button = (props: HTMLAttributes<HTMLButtonElement>) => {
  const { className = "", children, ...legacy } = props;
  return (
    <button
      {...legacy}
      className={`${className} transition-all rounded-lg border border-solid border-text p-2 flex items-center justify-center bg-background shadow-[1px_1px_5px_0_rgba(0,0,0,0.3)] hover:shadow-none`}
    >
      <span>{children}</span>
    </button>
  );
};
