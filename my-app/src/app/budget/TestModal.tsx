'use client';

import { useState } from 'react';

export const TestModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    console.log('Opening test modal');
    setIsOpen(true);
  };

  const closeModal = () => {
    console.log('Closing test modal');
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="rounded-lg bg-red-500 px-4 py-2 text-white"
      >
        Test Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Test Modal</h2>
            <p className="mb-6">This is a test modal to check if modals are working correctly.</p>
            <button
              onClick={closeModal}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
