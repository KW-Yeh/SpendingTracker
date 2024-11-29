"use client";
import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";

interface Props {
  children: ReactNode;
}

export const Modal = forwardRef<ModalRef, Props>((props, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      dialogRef.current?.showModal();
    },
    close: () => {
      dialogRef.current?.close();
    },
  }));

  const handleCloseModal = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog ref={dialogRef} className="relative p-6 rounded-2xl">
      <button
        type="button"
        onClick={handleCloseModal}
        className="absolute top-1 right-1 rounded-full flex items-center transition-colors justify-center size-6 hover:bg-gray-200"
      >
        <span className="text-sm">x</span>
      </button>
      {props.children}
    </dialog>
  );
});
