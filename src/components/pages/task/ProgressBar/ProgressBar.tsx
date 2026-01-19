import { motion } from 'framer-motion';
import { getExperienceByLevel } from '@/utils/level';
import styles from './ProgressBar.module.pcss';

type Props = {
  currentExperience: number;
  addedExperience: number;
  categoryLevel: number;
};

export const ProgressBar = ({
  currentExperience,
  addedExperience,
  categoryLevel,
}: Props) => {
  const expToLevelUp = getExperienceByLevel(categoryLevel + 1);

  const basePercent = Math.min((currentExperience / expToLevelUp) * 100, 100);
  const addedPercent = Math.min(
    ((currentExperience + addedExperience) / expToLevelUp) * 100,
    100,
  );

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
