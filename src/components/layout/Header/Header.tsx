import {
  CalendarIcon,
  DashboardIcon,
  PersonIcon,
  StarIcon,
} from '@radix-ui/react-icons';
import { NavLink } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { NavButton } from './NavButton/NavButton';

type Link = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const LINKS: Link[] = [
  { label: 'Статистика', href: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
  { label: 'Планирование', href: ROUTES.MAIN, icon: <CalendarIcon /> },
  { label: 'Таблица лидеров', href: ROUTES.LEADERBOARD, icon: <StarIcon /> },
];

export const Header = () => (
  <header className='flex flex-row justify-between  bg-card rounded-full p-2'>
    <nav className='flex gap-1'>
      {LINKS.map(link => (
        <NavButton
          key={link.href}
          {...link}
        />
      ))}
    </nav>
    <NavLink
      className='rounded-full p-4 bg-background'
      to={ROUTES.PROFILE}
    >
      <PersonIcon />
    </NavLink>
  </header>
);
