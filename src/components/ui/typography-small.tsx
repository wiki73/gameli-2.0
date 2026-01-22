import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export const TypographySmall = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <small className={cn('text-sm leading-none font-medium', className)}>
    {children}
  </small>
);
