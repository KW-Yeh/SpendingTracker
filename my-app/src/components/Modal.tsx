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
        className={`animate-modal relative max-h-[90vh] w-full max-w-2xl self-end rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl sm:max-w-96 sm:self-center sm:rounded-xl ${props.className}`}
      >
        <button
          type="button"
          onClick={handleCloseModal}
          className="hover:text-primary-400 focus-visible:outline-primary-400 absolute top-4 right-4 z-10 size-10 rounded-full bg-gray-700/90 p-2 text-gray-400 backdrop-blur-sm transition-all duration-200 hover:bg-gray-600 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          aria-label="Close modal"
        >
          <CloseIcon className="size-full" />
        </button>
        <div className="from-primary-500 to-accent-500 rounded-t-2xl bg-linear-to-r px-6 py-5 text-white sm:rounded-t-xl">
          <h2
            className="pr-12 text-lg font-bold sm:text-xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {props.title}
          </h2>
        </div>
        <div className="max-h-[calc(90vh-5rem)] overflow-y-auto p-6">
          {props.children}
        </div>
      </div>
    </div>
  );
});
Modal.displayName = 'Modal';
