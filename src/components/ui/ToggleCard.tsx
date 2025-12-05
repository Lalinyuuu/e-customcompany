'use client';

import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleCardProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export const ToggleCard = React.forwardRef<HTMLDivElement, ToggleCardProps>(
  (
    {
      checked,
      onCheckedChange,
      label,
      description,
      icon: Icon,
      disabled = false,
      className,
      variant = 'default',
    },
    ref
  ) => {
    const variantStyles = {
      default: checked
        ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
        : 'border-border bg-card hover:bg-accent/50',
      primary: checked
        ? 'border-primary bg-primary/10 dark:bg-primary/20'
        : 'border-border bg-card hover:bg-accent/50',
      success: checked
        ? 'border-green-500/50 bg-green-500/5 dark:bg-green-500/10'
        : 'border-border bg-card hover:bg-accent/50',
      warning: checked
        ? 'border-yellow-500/50 bg-yellow-500/5 dark:bg-yellow-500/10'
        : 'border-border bg-card hover:bg-accent/50',
      danger: checked
        ? 'border-red-500/50 bg-red-500/5 dark:bg-red-500/10'
        : 'border-border bg-card hover:bg-accent/50',
    };

    const iconStyles = {
      default: checked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
      primary: checked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground',
      success: checked
        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
        : 'bg-muted text-muted-foreground',
      warning: checked
        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
        : 'bg-muted text-muted-foreground',
      danger: checked
        ? 'bg-red-500/20 text-red-600 dark:text-red-400'
        : 'bg-muted text-muted-foreground',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
          'focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2',
          variantStyles[variant],
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        onClick={() => !disabled && onCheckedChange(!checked)}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onCheckedChange(!checked);
          }
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {Icon && (
            <div
              className={cn(
                'shrink-0 p-2 rounded-lg transition-colors duration-200',
                iconStyles[variant]
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                'text-sm font-medium transition-colors',
                checked ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {label}
            </div>
            {description && (
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</div>
            )}
          </div>
        </div>

        {/* Modern Toggle Switch */}
        <div className="shrink-0 ml-4">
          <div
            className={cn(
              'relative w-12 h-6 rounded-full transition-all duration-300 ease-in-out',
              checked ? 'bg-primary' : 'bg-muted',
              disabled && 'opacity-50'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out',
                checked && 'translate-x-6'
              )}
            />
          </div>
        </div>
      </div>
    );
  }
);

ToggleCard.displayName = 'ToggleCard';
