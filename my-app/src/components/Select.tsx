'use client';
import { CaretDown } from '@/components/icons/CaretDown';
import useFocusRef from '@/hooks/useFocusRef';
import {
  createContext,
  CSSProperties,
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
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});
  const ref = useFocusRef<HTMLDivElement>(() => {
    setOpenOptions(false);
  });

  const updateMenuPosition = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const direction = calVerticalDirection(element);
    const hDirection = calHorizontalDirection(element);
    const maxH = calMenuHeight(element, direction);
    setMenuMaxHeight(maxH);

    const style: CSSProperties = { minWidth: rect.width };
    if (direction === MenuOpenDirection.Down) {
      style.top = rect.bottom + 4;
      style.bottom = undefined;
    } else {
      // position from viewport bottom so fixed element appears above the trigger
      style.bottom = window.innerHeight - rect.top + 4;
      style.top = undefined;
    }
    if (hDirection === MenuOpenDirection.Left) {
      style.right = window.innerWidth - rect.right;
      style.left = undefined;
    } else {
      style.left = rect.left;
      style.right = undefined;
    }
    setDropdownStyle(style);
  }, [ref]);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      updateMenuPosition();
      window.addEventListener('scroll', updateMenuPosition, true);
      window.addEventListener('resize', updateMenuPosition);
      window.addEventListener('animationend', updateMenuPosition);
    }
    return () => {
      window.removeEventListener('scroll', updateMenuPosition, true);
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('animationend', updateMenuPosition);
    };
  }, [ref, updateMenuPosition]);

  const handleToggle = useCallback(() => {
    updateMenuPosition();
    setOpenOptions((prev) => !prev);
  }, [updateMenuPosition]);

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
          className={`${className} flex min-h-10 items-center justify-between gap-2`}
          type="button"
          onClick={handleToggle}
          aria-expanded={openOptions}
        >
          {(label || value) && (
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {label ?? value}
            </span>
          )}
          <CaretDown
            className={`size-3 shrink-0 transition-transform duration-200 ${openOptions ? 'rotate-180' : ''} ${caretStyle}`}
          />
        </button>
        <div
          className={`fixed z-[9999] overflow-hidden rounded-xl border-2 border-solid border-gray-600 bg-gray-800 py-1 shadow-xl backdrop-blur-sm transition-all duration-200 ${openOptions ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'}`}
          style={{
            ...dropdownStyle,
            maxHeight: menuMaxHeight,
          }}
        >
          <div
            className={`${menuStyle} scrollbar flex h-full w-full flex-col overflow-x-hidden overflow-y-auto`}
            style={{
              maxHeight: menuMaxHeight - 8,
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
      className={`flex min-h-11 w-full cursor-pointer px-4 py-3 transition-all duration-200 ${className} ${current === value ? 'bg-primary-500/20 text-primary-400 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'hover:text-primary-400 text-gray-300 hover:bg-gray-700/70 hover:shadow-[0_0_8px_rgba(6,182,212,0.15)] active:bg-gray-700'}`}
    >
      <span className="overflow-hidden text-left text-ellipsis whitespace-nowrap">
        {children}
      </span>
    </button>
  );
};

Select.Item = Item;

/** Walk up the DOM and return the viewport bounds of the nearest overflow container, or the viewport itself. */
const getContainerBounds = (
  element: HTMLElement,
): { top: number; bottom: number } => {
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const { overflow, overflowY } = window.getComputedStyle(parent);
    if (/auto|hidden|scroll/.test(overflow + overflowY)) {
      const rect = parent.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom };
    }
    parent = parent.parentElement;
  }
  return { top: 0, bottom: window.innerHeight };
};

const calVerticalDirection = (element: HTMLDivElement) => {
  const rect = element.getBoundingClientRect();
  const { top, bottom } = getContainerBounds(element);
  const spaceBelow = bottom - rect.bottom;
  const spaceAbove = rect.top - top;
  return spaceBelow >= spaceAbove ? MenuOpenDirection.Down : MenuOpenDirection.Up;
};

const calHorizontalDirection = (element: HTMLDivElement) => {
  const rect = element.getBoundingClientRect();
  return rect.left < (window.innerWidth - (rect.right - rect.left)) / 2
    ? MenuOpenDirection.Right
    : MenuOpenDirection.Left;
};

const calMenuHeight = (
  element: HTMLDivElement,
  openDirection: MenuOpenDirection,
) => {
  const rect = element.getBoundingClientRect();
  const { top, bottom } = getContainerBounds(element);
  if (openDirection === MenuOpenDirection.Down) {
    return bottom - rect.bottom - 4;
  } else {
    return rect.top - top - 4;
  }
};
