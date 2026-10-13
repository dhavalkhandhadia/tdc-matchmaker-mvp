import * as React from 'react';
import Image from 'next/image';
import { JourneyStage } from '@/lib/types';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/* BUTTON */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => {
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-accent text-white border border-accent hover:bg-accent-strong',
      secondary:
        'bg-wash text-ink border border-line hover:bg-wash hover:border-line-strong',
      outline:
        'bg-surface text-ink border border-line hover:bg-canvas hover:border-line-strong',
      ghost:
        'bg-transparent text-muted border border-transparent hover:bg-wash hover:text-ink',
      gold:
        'bg-warning-soft text-warning border border-line-strong hover:bg-warning-soft',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-11 px-3.5 text-[12px] rounded-full gap-1.5',
      md: 'h-11 px-5 text-[13px] rounded-full gap-2',
      lg: 'h-12 px-5 text-[14px] rounded-full gap-2',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'pressable inline-flex items-center justify-center font-medium whitespace-nowrap select-none disabled:opacity-45 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

/* INPUT */
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'min-h-11 w-full rounded-full border border-line bg-surface px-3 text-[13px] text-ink placeholder:text-faint transition-colors duration-150 focus:border-accent ',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => <textarea ref={ref} className={cn('field-textarea w-full rounded-[20px] border border-line-strong bg-surface p-4 text-[14px] leading-6 text-ink placeholder:text-faint transition-colors duration-150 focus:border-accent disabled:cursor-not-allowed disabled:opacity-50', className)} {...props} />
);
Textarea.displayName = 'Textarea';

/* STAGE BADGE */
const STAGE_STYLES: Record<
  JourneyStage,
  { bg: string; text: string; border: string; dot: string }
> = {
  Onboarding: {
    bg: 'bg-wash',
    text: 'text-muted',
    border: 'border-line',
    dot: 'bg-faint',
  },
  'Profile Verified': {
    bg: 'bg-warning-soft',
    text: 'text-warning',
    border: 'border-line-strong',
    dot: 'bg-warning',
  },
  'Sourcing Matches': {
    bg: 'bg-line',
    text: 'text-accent',
    border: 'border-line',
    dot: 'bg-accent-strong',
  },
  'Matches Sent': {
    bg: 'bg-line',
    text: 'text-accent',
    border: 'border-line-strong',
    dot: 'bg-accent-strong',
  },
  'In Dates / Feedback': {
    bg: 'bg-warning-soft',
    text: 'text-warning',
    border: 'border-line-strong',
    dot: 'bg-warning',
  },
  'Matched / Paused': {
    bg: 'bg-line',
    text: 'text-accent',
    border: 'border-line-strong',
    dot: 'bg-accent',
  },
};

export function StageBadge({
  stage,
  className,
}: {
  stage: JourneyStage;
  className?: string;
}) {
  const style = STAGE_STYLES[stage] || STAGE_STYLES.Onboarding;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium border',
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', style.dot)} />
      {stage}
    </span>
  );
}

/* PROFILE AVATAR */
export function ProfileAvatar({
  firstName,
  lastName,
  gender,
  profileId,
  size = 'md',
  className,
}: {
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  profileId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const sizeClass =
    size === 'xl'
      ? 'size-16 text-[22px] sm:size-20'
      : size === 'sm'
      ? 'w-8 h-8 text-[11.5px]'
      : size === 'lg'
      ? 'w-12 h-12 text-[15px]'
      : 'w-9 h-9 text-[12.5px]';

  const toneClass =
    gender === 'Female'
      ? 'bg-warning-soft text-warning border-line-strong'
      : 'bg-line text-accent border-line';

  return (
    <div
      className={cn(
        'relative aspect-square overflow-hidden rounded-full border flex items-center justify-center font-display font-medium shrink-0 select-none',
        sizeClass,
        toneClass,
        className
      )}
    >
      {profileId && /^(cust-\d+|pool-[fm]-\d+)$/.test(profileId)
        ? <Image src={`/images/profiles/${profileId}.webp`} alt="" aria-hidden fill sizes={size === 'xl' ? '(min-width: 640px) 80px, 64px' : size === 'lg' ? '48px' : size === 'sm' ? '32px' : '36px'} className="object-cover" />
        : initials}
    </div>
  );
}

/* COMPATIBILITY RING */
export function CompatibilityRing({
  score,
  size = 46,
}: {
  score: number;
  size?: number;
}) {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const isTopMatch = score >= 82;
  const isGoodMatch = score >= 68 && score < 82;

  const strokeColor = isTopMatch
    ? 'var(--accent)'
    : isGoodMatch
    ? 'var(--warning)'
    : 'var(--muted)';

  const bgTint = isTopMatch
    ? 'var(--accent-soft)'
    : isGoodMatch
    ? 'var(--warning-soft)'
    : 'var(--wash)';

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0 rounded-full"
      style={{ width: size, height: size, backgroundColor: bgTint }}
      aria-label={`${score} out of 100, rule-based fit guide`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono-tabular text-[12px] font-medium text-ink">
        {score}
      </span>
    </div>
  );
}

/* SEGMENTED TABS */
export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  className,
  disabled,
}: {
  options: SegmentedOption<T>[];
  value: T | null;
  onChange: (val: T) => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 rounded-full bg-wash border border-line',
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'pressable min-h-11 px-3 py-1 rounded-full text-[12.5px] font-medium inline-flex items-center gap-1.5',
              active
                ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(26,23,20,0.06)] border border-line'
                : 'text-muted hover:text-ink border border-transparent'
            )}
          >
            <span>{opt.label}</span>
            {typeof opt.count === 'number' && (
              <span
                className={cn(
                  'font-mono-tabular text-[11px] px-1.5 py-0.2 rounded-full',
                  active
                    ? 'bg-line text-accent'
                    : 'bg-line text-faint'
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
