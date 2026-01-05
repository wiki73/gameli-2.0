import styles from './Button.module.css';

export const Button = ({ onClick, children }) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      type='button'
    >
      {children}
    </button>
  );
};
