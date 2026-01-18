import classes from './Logo.module.pcss';

export const Logo = ({ className }: { className?: string }) => (
  <div className={`${classes.logo} ${className ?? ''}`}>
    <img
      alt='Gameli'
      className={classes.logoImage}
      src='/images/icon-512x512.png'
    />
    <h1 className={classes.logoText}>Gameli 0.0.1 Alpha</h1>
  </div>
);
