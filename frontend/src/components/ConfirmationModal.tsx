import React from "react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl animate-scaleUp">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">{message}</p>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-slate-700 hover:border-slate-650 bg-slate-950/40 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-red-650/25 transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
