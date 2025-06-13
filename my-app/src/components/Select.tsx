'use client';
import { CaretDown } from '@/components/icons/CaretDown';
import useFocusRef from '@/hooks/useFocusRef';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Props {
  value?: string;
  label?: ReactNode;
  name: string;
  onChange: (value: string) => void;
  children?: ReactNode;
  className?: string;
  caretStyle?: string;
  menuStyle?: string;
}

enum MenuOpenDirection {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

export const Select = (props: Props) => {
  const {
    children,
    className = '',
    caretStyle = '',
    menuStyle = '',
    onChange,
    value,
    label,
    name,
  } = props;
  const [openOptions, setOpenOptions] = useState(false);
  const [menuMaxHeight, setMenuMaxHeight] = useState(0);
  const [openVerticalDirection, setOpenVerticalDirection] =
    useState<MenuOpenDirection>(MenuOpenDirection.Down);
  const [openHorizontalDirection, setOpenHorizontalDirection] =
    useState<MenuOpenDirection>(MenuOpenDirection.Left);
  const ref = useFocusRef<HTMLDivElement>(() => {
    setOpenOptions(false);
  });

  const updateMenuHeight = useCallback(() => {
    const element = ref.current;
    if (element) {
      const direction = calVerticalDirection(element);
      setOpenVerticalDirection(direction);
      setOpenHorizontalDirection(calHorizontalDirection(element));
      setMenuMaxHeight(calMenuHeight(element, direction));
    }
  }, [ref]);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      updateMenuHeight();
      window.addEventListener('scroll', updateMenuHeight);
      window.addEventListener('animationend', updateMenuHeight);
    }
    return () => {
      window.removeEventListener('scroll', updateMenuHeight);
      window.removeEventListener('animationend', updateMenuHeight);
    };
  }, [ref, updateMenuHeight]);

  return (
    <Ctx.Provider
      value={{
        onChange,
        value,
        close: () => setOpenOptions(false),
      }}
    >
      <div ref={ref} className="relative w-full">
        <button
          className={`${className} flex items-center justify-between gap-1`}
          type="button"
          onClick={() => setOpenOptions((prevState) => !prevState)}
        >
          {(label || value) && (
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {label ?? value}
            </span>
          )}
          <CaretDown className={`size-2 shrink-0 ${caretStyle}`} />
        </button>
        <div
          className={`${openVerticalDirection === MenuOpenDirection.Down ? 'top-full mt-1' : 'bottom-full mb-1'} ${openHorizontalDirection === MenuOpenDirection.Left ? 'right-0' : 'left-0'} bg-background absolute z-40 w-fit overflow-hidden rounded-lg border border-solid border-gray-300 py-2 shadow transition-all ${openOptions ? 'visible opacity-100' : 'invisible opacity-0'}`}
          style={{
            minWidth: (ref.current?.clientWidth ?? 0) - 8 + 'px',
            maxHeight: menuMaxHeight + 'px',
          }}
        >
          <div
            className={`${menuStyle} scrollbar flex h-full w-full flex-col overflow-x-hidden overflow-y-auto`}
            style={{
              maxHeight: menuMaxHeight - 8 + 'px',
            }}
          >
            {children}
          </div>
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
      className={`flex w-full px-4 py-2 transition-colors ${className} ${current === value ? 'bg-primary-100' : 'hover:bg-primary-100'}`}
    >
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {children}
      </span>
    </button>
  );
};

Select.Item = Item;

const calVerticalDirection = (element: HTMLDivElement) => {
  const dropdownHeight =
    element.getBoundingClientRect().bottom -
    element.getBoundingClientRect().top;
  return element.getBoundingClientRect().top <
    (window.innerHeight - dropdownHeight) / 2
    ? MenuOpenDirection.Down
    : MenuOpenDirection.Up;
};

const calHorizontalDirection = (element: HTMLDivElement) => {
  const dropdownWidth =
    element.getBoundingClientRect().right -
    element.getBoundingClientRect().left;

  return element.getBoundingClientRect().left <
    (window.innerWidth - dropdownWidth) / 2
    ? MenuOpenDirection.Right
    : MenuOpenDirection.Left;
};

const calMenuHeight = (
  element: HTMLDivElement,
  openDirection: MenuOpenDirection,
) => {
  if (openDirection === MenuOpenDirection.Down) {
    return window.innerHeight - element.getBoundingClientRect().bottom - 24;
  } else {
    return element.getBoundingClientRect().top - 24;
  }
};
