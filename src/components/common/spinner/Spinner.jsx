import styles from './Spinner.module.css';

export const Spinner = () => {
  return (
    <div
      aria-live='polite'
      className={styles.wrapperSmall}
      role='status'
    >
      <span className={styles.visuallyHidden}>Loading</span>
      <div
        aria-hidden='true'
        className={styles.spinnerSmall}
      />
    </div>
  );
};
