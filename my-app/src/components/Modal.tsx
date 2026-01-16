'use client';
import { CloseIcon } from '@/components/icons/CloseIcon';
import useFocusRef from '@/hooks/useFocusRef';
import { 
  forwardRef, 
  ReactNode, 
  useEffect,
  useImperativeHandle, 
  useState 
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
      document.body.style.position = "fixed"
    }
    return () => {
      document.body.style.position = "unset"
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        ref={contentRef}
        className={`bg-white animate-modal relative rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden ${props.className}`}
      >
        <button
          type="button"
          onClick={handleCloseModal}
          className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/90 backdrop-blur-sm p-2 text-gray-600 transition-all duration-200 hover:bg-white hover:text-primary-600 hover:scale-110 focus-visible:outline-primary-400"
          aria-label="Close modal"
        >
          <CloseIcon className="size-full" />
        </button>
        <div className="from-primary-500 to-accent-500 rounded-t-2xl bg-linear-to-r px-6 py-5 text-white">
          <h1 className="text-xl font-bold sm:text-2xl pr-12" style={{ fontFamily: 'var(--font-heading)' }}>
            {props.title}
          </h1>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">{props.children}</div>
      </div>
    </div>
  );
});
Modal.displayName = 'Modal';
