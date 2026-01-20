import { Category } from '@/api/categories/types';
import { Card } from '@/components/ui/card';
import { CategoryList } from '../CategoryList/CategoryList';

type Props = {
  categories: Category[];
  isPending: boolean;
};

export const CategoryBlock = ({ categories, isPending }: Props) => (
  <Card className='p-10'>
    <h1 className='text-4xl font-bold'>Категории</h1>
    {!categories?.length && (
      <div className='p-5 border-2 rounded-2xl border-primary'>
        <h3>Нет категорий</h3>
        <p>
          Вы не создали ни одной категории, нажмите кнопку ниже, чтобы создать
        </p>
      </div>
    )}
    <CategoryList
      categories={categories}
      isPending={isPending}
    />
  </Card>
);
