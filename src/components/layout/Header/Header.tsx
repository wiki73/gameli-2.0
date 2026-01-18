import { CalendarIcon, DashboardIcon, PersonIcon } from '@radix-ui/react-icons';
import { NavLink } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { Button } from '../../common/Button/Button';
import { Card } from '../../common/Card/Card';
import { NavButton } from './NavButton/NavButton';
import styles from './Header.module.pcss';

type Link = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const LINKS: Link[] = [
  { label: 'Статистика', href: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
  { label: 'Планирование', href: ROUTES.MAIN, icon: <CalendarIcon /> },
];

export const Header = () => (
  <header className={styles.header}>
    <Card className={styles.headerInner}>
      <nav className={styles.nav}>
        {LINKS.map(link => (
          <NavButton
            key={link.href}
            {...link}
          />
        ))}
      </nav>
      <NavLink
        className={styles.profileButton}
        to={ROUTES.PROFILE}
      >
        <Button
          className={styles.profileButton}
          size='icon'
          variant='secondary'
        >
          <PersonIcon />
        </Button>
      </NavLink>
    </Card>
  </header>
);
