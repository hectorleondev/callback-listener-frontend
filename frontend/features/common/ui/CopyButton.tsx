'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Button, ButtonProps } from '@/components/ui/button';

interface CopyButtonProps extends ButtonProps {
  value: string;
  onCopy?: () => void;
  className?: string;
}

export function CopyButton({ value, onCopy, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  React.useEffect(() => {
    if (hasCopied) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  const handleClick = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setHasCopied(true);
      onCopy?.();
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [value, onCopy]);

  return (
    <Button
      size="sm"
      variant="ghost"
      className={cn(
        'relative transition-all duration-200',
        isAnimating && 'scale-105',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}