import styles from './Button.module.css';

/**
 * variant: primary, secondary, danger
 */

export const Button = ({
  onClick,
  children,
  type = 'button',
  disabled,
  variant,
}) => {
  return (
    <button
      className={styles.button + ' ' + styles[variant]}
      disabled={disabled}
      onClick={onClick}
      // eslint-disable-next-line react/button-has-type
      type={type}
    >
      {children}
    </button>
  );
};
