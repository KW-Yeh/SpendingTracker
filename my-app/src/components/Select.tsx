'use client';
import { CaretDown } from '@/components/icons/CaretDown';
import useFocusRef from '@/hooks/useFocusRef';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  value?: string;
  name: string;
  onChange: (value: string) => void;
  children?: ReactNode;
  className?: string;
  caretStyle?: string;
  menuStyle?: string;
}

export const Select = (props: Props) => {
  const {
    children,
    className = '',
    caretStyle = '',
    menuStyle = '',
    onChange,
    value,
    name,
  } = props;
  const [openOptions, setOpenOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const ref = useFocusRef<HTMLDivElement>(() => {
    setOpenOptions(false);
  });

  useEffect(() => {
    if (openOptions && menuRef.current) {
      let maxWidth = 0;
      menuRef.current.querySelectorAll('button').forEach((button) => {
        const textElementWidth = button.querySelector('span')?.clientWidth;
        maxWidth = Math.max(maxWidth, textElementWidth ?? 0);
      });
      const width = Math.max(menuRef.current.offsetWidth, maxWidth + 32);
      menuRef.current.style.width = `${width}px`;
    }
  }, [openOptions, menuRef]);

  return (
    <Ctx.Provider
      value={{
        onChange,
        value,
        close: () => setOpenOptions(false),
      }}
    >
      <div ref={ref} className="relative">
        <button
          className={`${className} flex items-center justify-between gap-1`}
          type="button"
          onClick={() => setOpenOptions((prevState) => !prevState)}
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {value}
          </span>
          <CaretDown className={`size-2 shrink-0 ${caretStyle}`} />
        </button>
        <div
          ref={menuRef}
          className={`${menuStyle} absolute top-full z-40 flex min-w-16 flex-col divide-y divide-gray-300 rounded-md bg-background py-2 shadow transition-all ${openOptions ? 'visible opacity-100' : 'invisible opacity-0'}`}
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
      className={`flex w-full bg-transparent px-4 py-2 transition-colors hover:bg-gray-300 ${className} ${current === value ? '' : ''}`}
    >
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {children}
      </span>
    </button>
  );
};

Select.Item = Item;
