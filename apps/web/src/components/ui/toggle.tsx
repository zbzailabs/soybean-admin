import type { ButtonHTMLAttributes } from 'react';
import { cn } from '#/lib/cn';

interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function ToggleButton({ className, active, ...props }: ToggleButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-sm transition-colors hover:bg-muted',
        active && 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
        className
      )}
      {...props}
    />
  );
}
