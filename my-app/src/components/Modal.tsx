'use client';
import { CloseIcon } from '@/components/icons/CloseIcon';
import useFocusRef from '@/hooks/useFocusRef';
import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

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

  useEffect(() => {
    if (open) {
      document.body.style.position = 'fixed';
    }
    return () => {
      document.body.style.position = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div
        ref={contentRef}
        className={`animate-modal relative flex max-h-[90dvh] w-full max-w-2xl flex-col self-end rounded-2xl border border-gray-700 bg-gray-950 shadow-xl sm:max-w-96 sm:self-center sm:rounded-xl ${props.className}`}
      >
        <button
          type="button"
          onClick={handleCloseModal}
          className="focus-visible:outline-primary-400 absolute top-4 right-4 z-10 size-6 rounded-full bg-[rgba(210,210,215,0.64)] p-2 text-gray-200 backdrop-blur-sm transition-all duration-200 hover:bg-gray-600 active:scale-95"
          aria-label="Close modal"
        >
          <CloseIcon className="size-full" />
        </button>
        <div className="rounded-t-2xl border-b border-gray-700 bg-gray-950 px-5 py-4 text-gray-100 sm:rounded-t-xl">
          <h3
            className="pr-12 text-base font-semibold sm:text-lg"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {props.title}
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{props.children}</div>
      </div>
    </div>
  );
});
Modal.displayName = 'Modal';
