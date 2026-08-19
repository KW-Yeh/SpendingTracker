'use client';

import { HTMLAttributes, ReactNode, useState } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  summary: ReactNode | ((isOpen: boolean) => ReactNode);
  defaultOpen?: boolean;
  buttonProps?: HTMLAttributes<HTMLButtonElement>;
  /** 傳入 `open` 即切換為受控模式（讓外部也能展開，例如年度概覽點月份）。 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Accordion = (props: Props) => {
  const {
    summary,
    defaultOpen = false,
    children,
    buttonProps,
    open,
    onOpenChange,
    ...legacy
  } = props;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;
  const toggle = () => {
    if (!isControlled) setUncontrolledOpen((prevState) => !prevState);
    onOpenChange?.(!isOpen);
  };
  return (
    <div {...legacy}>
      <button type="button" {...buttonProps} onClick={toggle}>
        {typeof summary === 'function' ? summary(isOpen) : summary}
      </button>
      <div
        className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
