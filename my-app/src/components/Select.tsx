'use client';
import { CaretDown } from '@/components/icons/CaretDown';
import useFocusRef from '@/hooks/useFocusRef';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Props {
  value?: string;
  name: string;
  onChange: (value: string) => void;
  children?: ReactNode;
  className?: string;
  caretStyle?: string;
}

export const Select = (props: Props) => {
  const {
    children,
    className = '',
    caretStyle = '',
    onChange,
    value,
    name,
  } = props;
  const [openOptions, setOpenOptions] = useState(false);
  const ref = useFocusRef<HTMLDivElement>(() => {
    setOpenOptions(false);
  });

  useEffect(() => {
    if (openOptions && ref.current) {
      ref.current.style.width = `${ref.current.offsetWidth}px`;
    }
  }, [openOptions, ref]);

  return (
    <Ctx.Provider
      value={{
        onChange,
        value,
        close: () => setOpenOptions(false),
      }}
    >
      <div className="relative">
        <button
          className={`${className} flex min-w-10 items-center justify-between gap-1 sm:min-w-16`}
          type="button"
          onClick={() => setOpenOptions((prevState) => !prevState)}
        >
          <span>{value}</span>
          <CaretDown className={`size-2 ${caretStyle}`} />
        </button>
        <div
          ref={ref}
          className={`absolute top-full flex min-w-16 flex-col divide-y divide-gray-300 rounded-md bg-background py-2 shadow transition-all ${openOptions ? 'visible opacity-100' : 'invisible opacity-0'}`}
        >
          {children}
        </div>
      </div>
      <input value={value} name={name} className="hidden" readOnly></input>
    </Ctx.Provider>
  );
};

const Ctx = createContext<{
  onChange: (value: string) => void;
  value?: string;
  close: () => void;
}>({
  onChange: () => {},
  value: undefined,
  close: () => {},
});

const Item = ({
  className = '',
  value,
  children,
}: {
  className?: string;
  children: ReactNode;
  value: string;
}) => {
  const { value: current, onChange, close } = useContext(Ctx);
  return (
    <button
      type="button"
      onClick={() => {
        onChange(value);
        close();
      }}
      className={`whitespace-nowrap bg-transparent px-4 py-2 text-start transition-colors hover:bg-gray-300 ${className} ${current === value ? '' : ''}`}
    >
      {children}
    </button>
  );
};

Select.Item = Item;
