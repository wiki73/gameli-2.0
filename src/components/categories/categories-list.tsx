import { CategoryItem } from './categories-item';
import type { Category } from '../../../generated/prisma';

type Props = {
  categories: Category[];
};

export const CategoriesList = ({ categories }: Props) => (
  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
    {categories.map(category => (
      <CategoryItem
        category={category}
        key={category.id}
      />
    ))}
  </div>
);
