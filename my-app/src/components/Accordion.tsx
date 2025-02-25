'use client';

import { HTMLAttributes, ReactNode, useState } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  summary: ReactNode | ((isOpen: boolean) => ReactNode);
  defaultOpen?: boolean;
  buttonProps?: HTMLAttributes<HTMLButtonElement>;
}

export const Accordion = (props: Props) => {
  const {
    summary,
    defaultOpen = false,
    children,
    buttonProps,
    ...legacy
  } = props;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div {...legacy}>
      <button
        type="button"
        {...buttonProps}
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
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
