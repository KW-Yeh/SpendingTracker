"use client";
import { CloseIcon } from "@/components/icons/CloseIcon";
import useFocusRef from "@/hooks/useFocusRef";
import { forwardRef, ReactNode, useImperativeHandle, useState } from "react";

interface Props {
  children: ReactNode;
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
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-end justify-center bg-black/60 backdrop-blur-sm z-50">
      <div
        ref={contentRef}
        className="relative p-6 rounded-t-2xl w-full bg-background"
      >
        <button
          type="button"
          onClick={handleCloseModal}
          className="absolute top-1 right-1 rounded-full transition-colors size-6 p-1 hover:bg-gray-300"
        >
          <CloseIcon className="size-full" />
        </button>
        {props.children}
      </div>
    </div>
  );
});
Modal.displayName = "Modal";
