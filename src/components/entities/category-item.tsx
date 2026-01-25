import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import type { Category } from '@/api/categories/types';
import {
  getColorBySubjectLevel,
  PROGRESS_BAR_ANIMATION_DURATIONS,
} from '@/consts';
import { CategoryDeleteDialog } from '../widgets/CategoryBlock/category-delete-dialog';
import { TypographySmall } from '../ui/typography-small';
import { CategoryCreateEditDialog } from '../widgets/CategoryBlock/category-create-edit-dialog';
import { ProgressBar } from '../pages/task/progress-bar';

type Props = {
  category: Category;
  dayId?: string;
};

export const CategoryItem = ({ category, dayId }: Props) => (
  <Card
    className='flex flex-col justify-between'
    style={{
      boxShadow: `0px 0px 12px var(${getColorBySubjectLevel(category.level)})`,
    }}
  >
    <CardHeader>
      <CardTitle className='line-clamp-2'>{category.name}</CardTitle>
      <CardDescription className='line-clamp-3'>
        {category.description}
      </CardDescription>
    </CardHeader>
    <CardContent className='flex items-center justify-between gap-4'>
      <TypographySmall className='whitespace-nowrap'>
        Lvl. {category.level}
      </TypographySmall>
      {category.experience > 0 && (
        <ProgressBar
          addedExperience={0}
          animationDuration={PROGRESS_BAR_ANIMATION_DURATIONS.SHORT}
          categoryLevel={category.level}
          currentExperience={category.experience}
        />
      )}
      <div className='flex items-center gap-2'>
        <CategoryCreateEditDialog
          category={category}
          modeForm='EDIT'
        />

        <CategoryDeleteDialog
          dayId={dayId}
          id={category.id}
        />
      </div>
    </CardContent>
  </Card>
);
