'use client';

import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton';

export function TableLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 max-w-md">
        <Skeleton className="h-10 w-full" />
      </div>
      <SkeletonTable rows={5} cols={6} />
    </div>
  );
}
