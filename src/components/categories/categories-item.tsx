import Link from 'next/link';
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
  ROUTES,
} from '@/consts';
import { ProgressBar } from '../progress-bar';
import type { Category } from '../../../generated/prisma';

type Props = {
  category: Category;
};

export const CategoryItem = ({ category }: Props) => (
  <Link href={ROUTES.CATEGORY.replace(':categoryId', category.id)}>
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
      </CardContent>
    </Card>
  </Link>
);
