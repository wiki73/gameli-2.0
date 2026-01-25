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
  const expToLevelUp = getExperienceByLevel(categoryLevel + 1);

  const basePercent = Math.min(
    (currentExperience / expToLevelUp) * HUNDRED_PERCENT,
    HUNDRED_PERCENT,
  );
  const addedPercent = Math.min(
    ((currentExperience + addedExperience) / expToLevelUp) * HUNDRED_PERCENT,
    HUNDRED_PERCENT,
  );

  return (
    <div className='relative w-full h-6 rounded-4xl overflow-hidden'>
      <div className='absolute inset-0 bg-background' />

      <motion.div
        animate={{ width: `${String(basePercent)}%` }}
        className='absolute inset-0 bg-green-600 z-2 h-full'
        initial={{ width: 0 }}
        transition={{ duration: animationDuration, ease: 'easeInOut' }}
      />

      <motion.div
        animate={{ width: `${String(addedPercent)}%` }}
        className='absolute inset-0 bg-green-500 z-1 h-full'
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
