'use client';

import { ReactNode, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { cn } from './primitives';

const easeOut = [0.23, 1, 0.32, 1] as const;

export function Disclosure({ title, children, className, triggerClassName }: {
  title: ReactNode; children: ReactNode; className?: string; triggerClassName?: string;
}) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const reducedMotion = useReducedMotion();
  const duration = keyboard || reducedMotion ? 0 : open ? 0.22 : 0.18;

  return <div className={cn('disclosure', open && 'is-open', className)}>
    <button type="button" id={`${id}-trigger`} aria-expanded={open} aria-controls={`${id}-panel`}
      className={cn('disclosure-trigger', triggerClassName)}
      onClick={(event) => {
        setKeyboard(event.detail === 0);
        if (open && panel.current?.contains(document.activeElement)) event.currentTarget.focus({ preventScroll: true });
        setOpen((value) => !value);
      }}>
      <span className="min-w-0 text-left">{title}</span>
      <motion.span className="disclosure-chevron" aria-hidden
        animate={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }} transition={{ duration, ease: easeOut }}>
        <ChevronRight size={14} />
      </motion.span>
    </button>
    {/* Height preserves document flow as this small panel opens; transforms alone would overlap the next section. */}
    <motion.div ref={panel} id={`${id}-panel`} aria-labelledby={`${id}-trigger`} aria-hidden={!open} inert={!open}
      initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={{ height: { duration, ease: easeOut }, opacity: { duration: keyboard ? 0 : reducedMotion ? 0.1 : 0.14, ease: easeOut } }}
      className="overflow-hidden">
      <div className="px-3 pb-3 pt-1">{children}</div>
    </motion.div>
  </div>;
}
