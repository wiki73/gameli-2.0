import {
  CalendarIcon,
  DashboardIcon,
  PersonIcon,
  StarIcon,
} from '@radix-ui/react-icons';
import { ROUTES } from '@/consts';
import { ModeToggle } from '@/components/widgets/mode-toggle';
import { NavButton } from './nav-button';

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
  <header className='flex flex-row justify-between bg-card rounded-full p-2 fixed bottom-4 inset-x-4 md:relative md:inset-x-0 md:bottom-0 border border-border'>
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
        className='md:aspect-square rounded-full'
        href={ROUTES.PROFILE}
        icon={<PersonIcon />}
      />
      <ModeToggle className='h-full rounded-full aspect-square p-6' />
    </div>
  </header>
);
