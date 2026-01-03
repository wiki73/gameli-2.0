import styles from './Spinner.module.css';

export const FullScreenSpinner = () => {
  return (
    <div
      aria-live='polite'
      className={styles.wrapper}
      role='status'
    >
      <span className={styles.visuallyHidden}>Loading</span>
      <div
        aria-hidden='true'
        className={styles.spinner}
      />
    </div>
  );
};
