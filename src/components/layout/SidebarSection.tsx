import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SidebarSectionProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: 'surface' | 'muted' | 'elevated';
  children: ReactNode;
  className?: string;
}

const variantStyles = {
  surface: 'bg-card shadow-sm',
  muted: 'bg-muted/80',
  elevated: 'bg-secondary/60',
};

export function SidebarSection({
  title,
  description,
  action,
  variant = 'surface',
  children,
  className,
}: SidebarSectionProps) {
  const showHeader = Boolean(title || description || action);

  return (
    <section
      className={cn(
        'rounded-2xl border border-border p-4',
        variantStyles[variant],
        className,
      )}
    >
      {showHeader && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-tight">{title}</h2>}
            {description && (
              <p className={cn('text-xs text-muted-foreground', title && 'mt-0.5')}>
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
