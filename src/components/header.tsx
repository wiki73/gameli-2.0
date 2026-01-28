import {
  CalendarIcon,
  DashboardIcon,
  PersonIcon,
  StarIcon,
} from '@radix-ui/react-icons';
import { PenBoxIcon } from 'lucide-react';
import { ROUTES } from '@/consts';
import { NavButton } from './nav-button';
import { ModeToggle } from './ui/mode-toggle';

type Link = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const LINKS: Link[] = [
  {
    label: 'Статистика',
    href: ROUTES.DASHBOARD,
    icon: <DashboardIcon className='size-4' />,
  },
  {
    label: 'Планирование',
    href: ROUTES.MAIN,
    icon: <CalendarIcon className='size-4' />,
  },
  {
    label: 'Таблица лидеров',
    href: ROUTES.LEADERBOARD,
    icon: <StarIcon className='size-4' />,
  },
  {
    label: 'Привычки',
    href: ROUTES.HABITS,
    icon: <PenBoxIcon className='size-4' />,
  },
];

export const Header = () => (
  <header className='bg-card border-border fixed inset-x-4 bottom-4 z-50 flex w-full flex-row justify-between rounded-full border p-2 md:relative md:inset-x-0 md:bottom-0'>
    <nav className='flex gap-1'>
      {LINKS.map(link => (
        <NavButton
          key={link.href}
          {...link}
        />
      ))}
    </nav>
    <div className='flex gap-1'>
      <NavButton
        className='rounded-full md:aspect-square'
        href={ROUTES.PROFILE}
        icon={<PersonIcon />}
      />
      <ModeToggle className='aspect-square h-full rounded-full p-6' />
    </div>
  </header>
);
