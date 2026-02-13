import { CalendarIcon, Pencil1Icon, PersonIcon } from '@radix-ui/react-icons';
import { ROUTES } from '../consts';
import { NavButton } from './nav-button';
import { ModeToggle } from './ui/mode-toggle';

type Link = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const LINKS: Link[] = [
  {
    label: 'Календарь',
    href: ROUTES.MAIN,
    icon: <CalendarIcon className='size-4' />,
  },
  {
    label: 'Привычки',
    href: ROUTES.HABITS,
    icon: <Pencil1Icon className='size-4' />,
  },
];

export const Header = () => (
  <header className='bg-card border-border fixed inset-x-2 bottom-4 z-50 flex h-fit max-w-3xl flex-row justify-between rounded-xl border px-4 py-2 md:relative md:inset-x-0 md:bottom-0 md:w-full'>
    <nav className='flex items-center gap-2'>
      {LINKS.map(link => (
        <NavButton
          key={link.href}
          {...link}
        />
      ))}
    </nav>
    <div className='flex items-center gap-2'>
      <NavButton
        className='aspect-square h-12 w-12 p-4'
        href={ROUTES.PROFILE}
        icon={<PersonIcon className='h-full w-full' />}
      />
      <ModeToggle className='aspect-square h-12 w-12 p-4' />
    </div>
  </header>
);
