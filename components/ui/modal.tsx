'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { COLOR } from '@/lib/theme';

export function Modal({
  open,
  onClose,
  children,
  maxWidth = 'max-w-md',
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="ecl-fade-in fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 sm:p-8" onClick={onClose}>
      <div
        className={`ecl-scale-in relative mx-auto my-6 w-full ${maxWidth} rounded-2xl p-6 sm:my-10`}
        style={{ background: COLOR.bg }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="ecl-btn absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full"
          style={{ color: COLOR.textMuted, background: COLOR.recessed }}
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}
