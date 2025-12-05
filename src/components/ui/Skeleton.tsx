import * as React from 'react';
import { cn } from '@/lib/utils';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
  );
});
Skeleton.displayName = 'Skeleton';

export const SkeletonText = ({
  className,
  lines = 1,
  ...props
}: SkeletonProps & { lines?: number }) => {
  if (lines === 1) {
    return <Skeleton className={cn('h-4 w-full', className)} {...props} />;
  }
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={`skeleton-line-${index}`}
          className={cn('h-4', index === lines - 1 ? 'w-3/4' : 'w-full', className)}
          {...props}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className, ...props }: SkeletonProps) => (
  <div className={cn('rounded-xl border border-border p-6 space-y-4', className)} {...props}>
    <Skeleton className="h-6 w-1/3" />
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonTable = ({
  rows = 5,
  cols = 4,
  ...props
}: { rows?: number; cols?: number } & SkeletonProps) => {
  const gridColsClass =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
    }[cols] || 'grid-cols-4';

  return (
    <div className="space-y-3" {...props}>
      {/* Header */}
      <div className={`grid gap-4 ${gridColsClass}`}>
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={`header-col-${colIndex}`} className="h-4 w-full" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className={`grid gap-4 ${gridColsClass}`}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
};

export { Skeleton };
