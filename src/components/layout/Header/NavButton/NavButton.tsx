import { NavLink } from 'react-router';
import styles from './NavButton.module.pcss';

type Props = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

export const NavButton = ({ label, href, icon }: Props) => (
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
    <span className={styles.navButtonText}>{label}</span>
  </NavLink>
);
