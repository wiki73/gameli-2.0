'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils';

type Props = {
  label?: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
};

export const NavButton = ({ label, href, icon, className }: Props) => {
  const pathname = usePathname();
  const isActive = pathname.split('?')[0] === href.split('?')[0];

  return (
    <Link
      className={cn(
        'bg-background flex aspect-square h-fit items-center justify-center gap-1 rounded-md px-4 py-2 md:aspect-auto',
        isActive && 'bg-primary text-primary-foreground',
        className,
      )}
      href={href}
      key={href}
    >
      {icon}
      {!!label && <span className='hidden md:flex'>{label}</span>}
    </Link>
  );
};
