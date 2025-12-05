'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  children,
  content,
  side = 'top',
  disabled = false,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (disabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleFocus = () => {
    if (disabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(true);
    }
  };

  const handleBlur = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!disabled) {
    return <>{children}</>;
  }

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-popover border-l-transparent border-r-transparent border-b-transparent',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-b-popover border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-popover border-t-transparent border-b-transparent border-r-transparent',
    right:
      'right-full top-1/2 -translate-y-1/2 border-r-popover border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-popover-foreground bg-popover border rounded-md shadow-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-200',
            sideClasses[side],
            className
          )}
          role="tooltip"
        >
          {content}
          <div className={cn('absolute w-0 h-0 border-4', arrowClasses[side])} />
        </div>
      )}
    </div>
  );
}
