import { NavLink } from 'react-router';
import { cn } from '@/lib/utils';

type Props = {
  label?: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
};

export const NavButton = ({ label, href, icon, className }: Props) => (
  <NavLink
    className={({ isActive }) =>
      cn(
        'flex p-2 px-4 bg-background items-center gap-1 rounded-full md:rounded-3xl aspect-square md:aspect-auto',
        isActive ? 'bg-primary text-primary-foreground' : '',
        className,
      )
    }
    key={href}
    to={href}
  >
    {icon}
    {!!label && <span className='hidden md:flex'>{label}</span>}
  </NavLink>
);
