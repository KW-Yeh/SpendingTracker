'use client';
import { CloseIcon } from '@/components/icons/CloseIcon';
import useFocusRef from '@/hooks/useFocusRef';
import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const Modal = forwardRef<ModalRef, Props>((props, ref) => {
  const [open, setOpen] = useState(false);
  const contentRef = useFocusRef<HTMLDivElement>(() => {
    setOpen(false);
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
    },
    close: () => {
      setOpen(false);
    },
  }));

  const handleCloseModal = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={contentRef}
        className={`relative w-full rounded-2xl bg-background p-6 sm:w-fit sm:min-w-96 ${props.className}`}
      >
        <button
          type="button"
          onClick={handleCloseModal}
          className="absolute right-1 top-1 size-6 rounded-full p-1 transition-colors hover:bg-gray-300"
        >
          <CloseIcon className="size-full" />
        </button>
        {props.children}
      </div>
    </div>
  );
});
Modal.displayName = 'Modal';
