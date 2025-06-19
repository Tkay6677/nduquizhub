'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number | null;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({
    className,
    value = null,
    max = 100,
    indicatorClassName,
    ...props
  }, ref) => {
    const safeMax = max > 0 ? max : 100;
    const safeValue = value === null || value === undefined ? null : Math.min(Math.max(0, value), safeMax);
    const percentage = safeValue === null ? 0 : (safeValue / safeMax) * 100;

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800',
          className
        )}
        role="progressbar"
        aria-valuenow={safeValue ?? undefined}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        {...props}
      >
        <div
          className={cn(
            'h-full w-full flex-1 bg-primary transition-all',
            indicatorClassName
          )}
          style={{
            transform: `translateX(-${100 - percentage}%)`,
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
export type { ProgressProps };
