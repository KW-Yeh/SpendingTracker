'use client';
import { CloseIcon } from '@/components/icons/CloseIcon';
import useFocusRef from '@/hooks/useFocusRef';
import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  title: ReactNode;
  onClose?: () => void;
  defaultOpen?: boolean;
}

export const Modal = forwardRef<ModalRef, Props>((props, ref) => {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const contentRef = useFocusRef<HTMLDivElement>(() => {
    props.onClose?.();
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
    props.onClose?.();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={contentRef}
        className={`bg-background animate-modal relative rounded-xl ${props.className}`}
      >
        <button
          type="button"
          onClick={handleCloseModal}
          className="bg-background absolute top-4 right-6 size-6 rounded-full p-1.5 text-gray-500 transition-colors hover:text-gray-700"
        >
          <CloseIcon className="size-full" />
        </button>
        <h1 className="from-primary-500 to-primary-600 rounded-t-xl bg-gradient-to-r px-6 py-4 text-lg font-semibold text-white sm:text-xl">
          {props.title}
        </h1>
        <div className="p-6">{props.children}</div>
      </div>
    </div>
  );
});
Modal.displayName = 'Modal';
