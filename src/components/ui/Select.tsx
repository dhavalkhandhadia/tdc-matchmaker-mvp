'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from './primitives';

export function Select({ value, onValueChange, options, label, id, className, disabled = false }: {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}) {
  return <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
    <SelectPrimitive.Trigger id={id} aria-label={label} className={cn('select-trigger pressable', className)}>
      <SelectPrimitive.Value />
      <SelectPrimitive.Icon className="select-chevron"><ChevronDown size={15} aria-hidden /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content position="popper" sideOffset={8} collisionPadding={12} className="select-menu">
        <SelectPrimitive.ScrollUpButton className="select-scroll"><ChevronUp size={15} aria-hidden /></SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="select-viewport">
          {options.map((option) => <SelectPrimitive.Item key={option.value} value={option.value} className="select-option">
            <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator className="select-check"><Check size={15} aria-hidden /></SelectPrimitive.ItemIndicator>
          </SelectPrimitive.Item>)}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="select-scroll"><ChevronDown size={15} aria-hidden /></SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>;
}
