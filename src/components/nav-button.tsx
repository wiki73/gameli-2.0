import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  label?: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
};

export const NavButton = ({ label, href, icon, className }: Props) => (
  <Link
    className={cn(
      'bg-background flex aspect-square items-center justify-center gap-1 rounded-full p-2 px-4 md:aspect-auto md:rounded-3xl',
      className,
    )}
    href={href}
    key={href}
  >
    {icon}
    {!!label && <span className='hidden md:flex'>{label}</span>}
  </Link>
);
