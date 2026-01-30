import { motion } from 'framer-motion';
import {
  getExperienceByLevel,
  HUNDRED_PERCENT,
  PROGRESS_BAR_ANIMATION_DURATIONS,
} from '@/consts';

export type AnimationDuration =
  (typeof PROGRESS_BAR_ANIMATION_DURATIONS)[keyof typeof PROGRESS_BAR_ANIMATION_DURATIONS];

type Props = {
  currentExperience: number;
  addedExperience: number;
  categoryLevel: number;
  animationDuration?: AnimationDuration;
};

export const ProgressBar = ({
  currentExperience,
  addedExperience,
  categoryLevel,
  animationDuration = PROGRESS_BAR_ANIMATION_DURATIONS.LONG,
}: Props) => {
  const currentLevelExp = getExperienceByLevel(categoryLevel);
  const initialExp = currentExperience - currentLevelExp;
  const expToLevelUp =
    getExperienceByLevel(categoryLevel + 1) - currentLevelExp;

  const basePercent = Math.min(
    (initialExp / expToLevelUp) * HUNDRED_PERCENT,
    HUNDRED_PERCENT,
  );
  const addedPercent = Math.min(
    ((initialExp + addedExperience) / expToLevelUp) * HUNDRED_PERCENT,
    HUNDRED_PERCENT,
  );

  return (
    <div className='relative h-6 w-full overflow-hidden rounded-4xl'>
      <div className='bg-background absolute inset-0' />

      <motion.div
        animate={{ width: `${String(basePercent)}%` }}
        className='absolute inset-0 z-2 h-full bg-green-600'
        initial={{ width: 0 }}
        transition={{ duration: animationDuration, ease: 'easeInOut' }}
      />

      <motion.div
        animate={{ width: `${String(addedPercent)}%` }}
        className='absolute inset-0 z-1 h-full bg-green-500'
        initial={{ width: 0 }}
        transition={{
          duration: animationDuration,
          ease: 'easeInOut',
          delay: 0.3,
        }}
      />
    </div>
  );
};
