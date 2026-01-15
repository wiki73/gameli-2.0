import {
  CalendarIcon,
  DashboardIcon,
  HomeIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { Card } from '../../common/Card/Card';
import { appConfig } from '../../../config/env';
import { Button } from '../../common/Button/Button';
import styles from './Header.module.pcss';
import { NavButton } from './NavButton/NavButton';

type Link = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const LINKS: Link[] = [
  { label: 'Статистика', href: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
  { label: 'Планирование', href: ROUTES.PLANNING, icon: <CalendarIcon /> },
];

export const Header = () => {
  const [links, setLinks] = useState(LINKS);

  useEffect(() => {
    if (appConfig.showMainPage) {
      setLinks([
        { label: 'Главная', href: ROUTES.MAIN, icon: <HomeIcon /> },
        ...LINKS,
      ]);
    }
  }, []);

  return (
    <header className={styles.header}>
      <Card className={styles.headerInner}>
        <nav className={styles.nav}>
          {links.map(link => (
            <NavButton
              key={link.href}
              {...link}
            />
          ))}
        </nav>
        <NavLink to={ROUTES.PROFILE}>
          <Button
            size='icon'
            variant='secondary'
          >
            <PersonIcon />
          </Button>
        </NavLink>
      </Card>
    </header>
  );
};
