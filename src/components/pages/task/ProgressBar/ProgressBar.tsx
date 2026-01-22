import { motion } from 'framer-motion';
import { getExperienceByLevel } from '@/utils/level';

type Props = {
  currentExperience: number;
  addedExperience: number;
  categoryLevel: number;
  animationDuration?: number;
};

export const ProgressBar = ({
  currentExperience,
  addedExperience,
  categoryLevel,
  animationDuration = 2.8,
}: Props) => {
  const expToLevelUp = getExperienceByLevel(categoryLevel + 1);

  const basePercent = Math.min((currentExperience / expToLevelUp) * 100, 100);
  const addedPercent = Math.min(
    ((currentExperience + addedExperience) / expToLevelUp) * 100,
    100,
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
