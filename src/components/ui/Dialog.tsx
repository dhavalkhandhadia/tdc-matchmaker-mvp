'use client';

import { useEffect, useRef } from 'react';
import { cn } from './primitives';

export function Dialog({ open, onClose, labelledBy, className, children }: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);

  return <dialog ref={ref} aria-labelledby={labelledBy}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) onClose();
    }}
    className={cn('animate-modal m-auto max-h-[90dvh] w-[calc(100%_-_24px)] overflow-hidden rounded-[28px] border border-line bg-surface p-0 text-ink shadow-[0_24px_100px_rgba(40,33,28,.2)]', className)}>
    <div className="dialog-content max-h-[calc(90dvh_-_2px)] overflow-y-auto rounded-[27px]">{children}</div>
  </dialog>;
}
