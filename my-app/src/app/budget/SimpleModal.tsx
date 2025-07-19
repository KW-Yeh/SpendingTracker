'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BiX } from 'react-icons/bi';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SimpleModal = ({ isOpen, onClose, title, children }: SimpleModalProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!isOpen || !mounted) {
    return null;
  }
  
  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button 
              onClick={onClose}
              className="rounded-full bg-white bg-opacity-20 p-1.5 text-gray-500 transition-colors hover:text-gray-700"
              type="button"
            >
              <BiX className="size-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
};
