import { cn } from '@/lib/utils';
import { CategoryItem } from './categories-item';
import type { Category } from '../../../generated/prisma';

type Props = {
  categories: Category[];
};

export const CategoriesList = ({ categories }: Props) => (
  <div
    className={cn(
      'grid grid-cols-1 gap-4',
      categories.length > 1 && 'md:grid-cols-2',
    )}
  >
    {categories.map(category => (
      <CategoryItem
        category={category}
        key={category.id}
      />
    ))}
  </div>
);
