import { NavLink } from 'react-router';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

export const NavButton = ({ label, href, icon }: Props) => (
  <NavLink
    className={({ isActive }) =>
      cn(
        'flex p-2 px-4 bg-background items-center gap-1 rounded-3xl',
        isActive ? 'bg-primary text-primary-foreground' : '',
      )
    }
    key={href}
    to={href}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);
