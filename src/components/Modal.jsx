"use client";

import { useEffect } from "react";

export default function Modal({ message, onClose, isError }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000032] bg-opacity-5 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className={`text-center text-lg font-medium ${
            isError ? "text-red-300" : "text-white"
          }`}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-[#450A4A] py-3 font-semibold text-white transition-colors hover:bg-[#350838]"
          aria-label="Close modal"
        >
          Stäng
        </button>
      </div>
    </div>
  );
}
