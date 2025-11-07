/**
 * Card Component
 * 
 * Reusable card container for dashboard elements.
 * Provides consistent styling across the application.
 */

import { cn } from '@/lib/utils/helpers';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  gradient?: boolean;
  hover?: boolean;
}

export function Card({ 
  children, 
  className, 
  title, 
  subtitle, 
  action,
  gradient = false,
  hover = false
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--card-border)] bg-[var(--card-background)] p-6',
        'transition-all duration-200',
        hover && 'hover:border-[var(--polkadot-pink)]/30 hover:shadow-lg hover:shadow-[var(--polkadot-pink)]/10',
        gradient && 'bg-gradient-to-br from-[var(--card-background)] to-[var(--hover)]',
        className
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="ml-4">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-[var(--text-primary)]', className)}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('text-[var(--text-primary)]', className)}>
      {children}
    </div>
  );
}


