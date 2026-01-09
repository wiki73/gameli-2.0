import { NavLink } from 'react-router';
import {
  DashboardIcon,
  HomeIcon,
  LayersIcon,
  PersonIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { Card } from '../../common/Card/Card';
import { appConfig } from '../../../config/env';
import styles from './Header.module.css';

const LINKS = [
  { name: 'Статистика', href: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
  { name: 'Категории', href: ROUTES.CATEGORIES, icon: <LayersIcon /> },
  { name: 'Профиль', href: ROUTES.PROFILE, icon: <PersonIcon /> },
  { name: 'День', href: ROUTES.DAY, icon: <SunIcon /> },
];

export const Header = () => {
  const [links, setLinks] = useState(LINKS);

  useEffect(() => {
    if (appConfig.showMainPage) {
      setLinks([
        { name: 'Главная', href: ROUTES.MAIN, icon: <HomeIcon /> },
        ...LINKS,
      ]);
    }
  }, []);

  const renderLink = ({ name, href, icon }) => (
    <NavLink
      className={({ isActive }) =>
        isActive
          ? [styles.navButton, styles.navButtonActive].join(' ')
          : styles.navButton
      }
      key={href}
      to={href}
    >
      {icon}
      <span className={styles.navButtonText}>{name}</span>
    </NavLink>
  );

  return (
    <header className={styles.header}>
      <Card>
        <nav className={styles.nav}>{links.map(renderLink)}</nav>
      </Card>
    </header>
  );
};
