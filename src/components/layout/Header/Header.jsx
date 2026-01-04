import { NavLink } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import styles from './Header.module.css';

const LINKS = [
  { name: 'Главная', href: ROUTES.MAIN },
  { name: 'Категории', href: ROUTES.CATEGORIES },
];

export const Header = () => {
  const renderLink = ({ name, href }) => (
    <NavLink
      className={({ isActive }) =>
        isActive
          ? [styles.navButton, styles.navButtonActive].join(' ')
          : styles.navButton
      }
      key={href}
      to={href}
    >
      {name}
    </NavLink>
  );

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>{LINKS.map(renderLink)}</nav>
    </header>
  );
};
