import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative z-10 w-full ${maxWidth} rounded-lg bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder p-6 shadow-2xl animate-modal-pop max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gh-lightBorder dark:border-gh-darkBorder">
          <h3 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-md text-gh-lightMuted dark:text-gh-darkMuted hover:bg-gray-100 dark:hover:bg-gh-darkCard hover:text-gh-lightText dark:hover:text-gh-darkText transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
