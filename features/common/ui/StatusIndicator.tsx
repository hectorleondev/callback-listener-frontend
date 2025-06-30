import React from 'react';
import { cn } from '@/lib/utils/cn';

interface StatusIndicatorProps {
  status: 'active' | 'paused' | 'error' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
  label?: string;
}

export function StatusIndicator({
  status,
  size = 'md',
  pulse = false,
  className,
  label,
}: StatusIndicatorProps) {
  const statusColorMap = {
    active: 'bg-success',
    success: 'bg-success',
    paused: 'bg-warning',
    warning: 'bg-warning',
    error: 'bg-destructive',
    info: 'bg-primary',
  };

  const sizeMap = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'rounded-full',
          statusColorMap[status],
          sizeMap[size],
          pulse && 'animate-pulse',
          className
        )}
      />
      {label && (
        <span className="text-xs font-medium">{label}</span>
      )}
    </div>
  );
}