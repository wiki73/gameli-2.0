import { motion } from 'framer-motion';
import styles from './ProgressBar.module.pcss';

export const ProgressBar = ({ currentExp, addedExp, maxExp }) => {
  const basePercent = Math.min((currentExp / maxExp) * 100, 100);
  const addedPercent = Math.min(((currentExp + addedExp) / maxExp) * 100, 100);

  return (
    <div className={styles.container}>
      <div className={styles.track} />

      <motion.div
        animate={{ width: `${basePercent}%` }}
        className={styles.base}
        initial={{ width: 0 }}
        transition={{ duration: 2.8, ease: 'easeInOut' }}
      />

      <motion.div
        animate={{ width: `${addedPercent}%` }}
        className={styles.added}
        initial={{ width: 0 }}
        transition={{ duration: 2.8, ease: 'easeInOut', delay: 0.3 }}
      />
    </div>
  );
};
