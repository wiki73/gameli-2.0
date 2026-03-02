import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import {
  getColorBySubjectLevel,
  PROGRESS_BAR_ANIMATION_DURATIONS,
} from '@/src/consts';
import { ProgressBar } from '../progress-bar';
import type { Category } from '../../../generated/prisma';

type Props = {
  category: Category;
};
export const CategoryItem = ({ category }: Props) => (
  <Card
    className='flex flex-col justify-between py-3 md:py-5'
    style={{
      boxShadow: `0px 0px 20px var(${getColorBySubjectLevel(category.level)})`,
    }}
  >
    <CardHeader>
      <CardTitle className='line-clamp-1'>{category.name}</CardTitle>
      <CardDescription className='line-clamp-3'>
        {category.description ? category.description : ''}
      </CardDescription>
    </CardHeader>
    <CardContent className='flex items-center justify-between gap-4'>
      {/* <p className='whitespace-nowrap'>Lvl. {category.level}</p> */}
      {category.experience > 0 ? (
        <ProgressBar
          addedExperience={0}
          animationDuration={PROGRESS_BAR_ANIMATION_DURATIONS.SHORT}
          categoryLevel={category.level}
          currentExperience={category.experience}
        />
      ):<ProgressBar
          addedExperience={0}
          animationDuration={PROGRESS_BAR_ANIMATION_DURATIONS.SHORT}
          categoryLevel={category.level}
          currentExperience={category.experience + 1}
        />}
    </CardContent>
  </Card>
);
