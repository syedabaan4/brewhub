"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="relative bg-[#F7F7F5] max-w-md w-full z-10"
        style={{
          borderRadius: "0px",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div
          className="bg-[#E97F8A] px-6 sm:px-8 py-6"
          style={{ borderBottom: "2px solid rgba(18,18,18,0.1)" }}
        >
          <div className="inline-block mb-3">
            <div className="bg-[#121212] px-4 py-1.5">
              <span className="text-[#F7F7F5] font-bold text-[10px] tracking-[0.15em] uppercase">
                Confirmation
              </span>
            </div>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#121212] leading-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-6">
          <p
            className="text-base text-[#121212] opacity-70 leading-relaxed"
            style={{ lineHeight: "1.7" }}
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          className="bg-white px-6 sm:px-8 py-6"
          style={{
            borderTop: "2px solid rgba(18,18,18,0.1)",
            boxShadow: "0px -4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-4 border-2 border-[#121212] text-[#121212] font-black text-xs tracking-[0.15em] uppercase transition-all hover:bg-[#121212] hover:text-[#F7F7F5] cursor-pointer"
              style={{ borderRadius: "0px" }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-4 bg-[#121212] text-[#F7F7F5] font-black text-xs tracking-[0.15em] uppercase transition-all hover:bg-opacity-90 hover:scale-105 cursor-pointer"
              style={{ borderRadius: "0px" }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
