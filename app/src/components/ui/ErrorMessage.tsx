/**
 * ErrorMessage Component
 * 
 * Displays error messages with retry functionality.
 * Helps users understand what went wrong and how to fix it.
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils/helpers';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'default' | 'inline' | 'full';
}

export function ErrorMessage({
  title = 'Error',
  message,
  onRetry,
  className,
  variant = 'default'
}: ErrorMessageProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-[var(--error)]', className)}>
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={cn('flex min-h-[400px] flex-col items-center justify-center gap-4', className)}>
        <div className="rounded-full bg-[var(--error)]/10 p-4">
          <AlertCircle className="h-12 w-12 text-[var(--error)]" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/5 p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-[var(--error)]" />
        <div className="flex-1">
          <h4 className="font-medium text-[var(--text-primary)]">{title}</h4>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{message}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Empty State Component
 * 
 * Shows when there's no data to display.
 * More friendly than showing nothing.
 */
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && (
        <div className="mb-4 rounded-full bg-[var(--card-background)] p-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}


