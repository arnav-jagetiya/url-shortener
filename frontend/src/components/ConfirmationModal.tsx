import React, { useEffect, useRef } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);

  // Escape key dismiss listener & Focus management
  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on close
    previouslyFocusedRef.current = document.activeElement;

    // Focus cancel button by default
    const timer = setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      // Restore focus
      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isOpen, onCancel]);

  // Trap focus between Cancel and Confirm buttons
  const handleKeyDownTrap = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const active = document.activeElement;
    
    if (e.shiftKey) {
      if (active === cancelButtonRef.current) {
        e.preventDefault();
        confirmButtonRef.current?.focus();
      }
    } else {
      if (active === confirmButtonRef.current) {
        e.preventDefault();
        cancelButtonRef.current?.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onKeyDown={handleKeyDownTrap}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
        onClick={onCancel}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-900 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 id="modal-title" className="text-lg font-bold text-white">
            {title}
          </h3>
        </div>

        <div id="modal-desc" className="text-xs text-slate-400 leading-relaxed space-y-2">
          <p>{message}</p>
          <p className="text-red-400 font-semibold flex items-center gap-1">
            ⚠️ This action cannot be undone.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="cursor-pointer rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="cursor-pointer rounded-xl bg-red-650 hover:bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:shadow-red-650/25 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
