import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  getColorBySubjectLevel,
  PROGRESS_BAR_ANIMATION_DURATIONS,
} from '@/consts';
import { ProgressBar } from '../progress-bar';
import { CategoryCreateEditDialog } from './category-create-edit-dialog';
import { CategoryDeleteDialog } from './category-delete-dialog';
import type { Category } from '../../../generated/prisma';

type Props = {
  category: Category;
};

export const CategoryItem = ({ category }: Props) => (
  <Card
    className='flex flex-col justify-between'
    style={{
      boxShadow: `0px 0px 15px var(${getColorBySubjectLevel(category.level)})`,
    }}
  >
    <CardHeader>
      <CardTitle className='line-clamp-2'>{category.name}</CardTitle>
      <CardDescription className='line-clamp-3'>
        {category.description}
      </CardDescription>
    </CardHeader>
    <CardContent className='flex items-center justify-between gap-4'>
      <p className='whitespace-nowrap'>Lvl. {category.level}</p>
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
          mode='EDIT'
        />

        <CategoryDeleteDialog id={category.id} />
      </div>
    </CardContent>
  </Card>
);
