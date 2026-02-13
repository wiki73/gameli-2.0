'use client';
import { motion } from 'framer-motion';
import {
  getExperienceByLevel,
  HUNDRED_PERCENT,
  PROGRESS_BAR_ANIMATION_DURATIONS,
} from '@/src/consts';

export type AnimationDuration =
  (typeof PROGRESS_BAR_ANIMATION_DURATIONS)[keyof typeof PROGRESS_BAR_ANIMATION_DURATIONS];

type Props = {
  currentExperience?: number | null;
  addedExperience?: number | null;
  categoryLevel?: number | null;
  categoryName?: string | null;
  animationDuration?: AnimationDuration;
};

const DEFAULT_VALUE = 0;
const DEFAULT_LEVEL = 1;

export const ProgressBar = ({
  currentExperience,
  addedExperience,
  categoryLevel,
  categoryName,
  animationDuration = PROGRESS_BAR_ANIMATION_DURATIONS.LONG,
}: Props) => {
  const safeCurrentExperience = currentExperience ?? DEFAULT_VALUE;
  const safeAddedExperience = addedExperience ?? DEFAULT_VALUE;
  const safeCategoryLevel = Math.max(categoryLevel ?? DEFAULT_LEVEL, 1);
  const safeCategoryName = categoryName ?? '';

  const currentLevelExp = getExperienceByLevel(safeCategoryLevel);
  const initialExp = Math.max(safeCurrentExperience - currentLevelExp, 0);
  const expToLevelUp = Math.max(
    getExperienceByLevel(safeCategoryLevel + 1) - currentLevelExp,
    1,
  );

  const basePercent = Math.min(
    (initialExp / expToLevelUp) * HUNDRED_PERCENT,
    HUNDRED_PERCENT,
  );

  const addedPercent = Math.min(
    ((initialExp + safeAddedExperience) / expToLevelUp) * HUNDRED_PERCENT,
    HUNDRED_PERCENT,
  );

  const safeBasePercent = isNaN(basePercent) ? 0 : basePercent;
  const safeAddedPercent = isNaN(addedPercent) ? 0 : addedPercent;

  return (
    <div className='w-full space-y-2'>
      <div className='mb-6 w-full text-center text-3xl font-medium text-gray-700'>
        {safeCategoryName}
      </div>

      <div className='flex items-center gap-3'>
        <span className='min-w-24px text-3xl font-bold text-gray-900'>
          {safeCategoryLevel}
        </span>

        <div className='relative h-6 flex-1 overflow-hidden rounded-4xl'>
          <div className='bg-background absolute inset-0' />

          <motion.div
            animate={{ width: `${String(safeBasePercent)}%` }}
            className='absolute inset-0 z-2 h-full bg-green-600'
            initial={{ width: 0 }}
            transition={{ duration: animationDuration, ease: 'easeInOut' }}
          />

          <motion.div
            animate={{ width: `${String(safeAddedPercent)}%` }}
            className='absolute inset-0 z-1 h-full bg-green-500'
            initial={{ width: 0 }}
            transition={{
              duration: animationDuration,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          />
        </div>

        <span className='min-w-24px text-3xl font-bold text-gray-900'>
          {safeCategoryLevel + 1}
        </span>
      </div>

      <div className='flex justify-between text-xs text-gray-500'>
        <span>
          {initialExp} / {expToLevelUp} XP
        </span>
        <span>+{safeAddedExperience} XP</span>
      </div>
    </div>
  );
};
