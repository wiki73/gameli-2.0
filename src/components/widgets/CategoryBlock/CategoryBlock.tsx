import { Category } from '@/api/categories/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { CategoryItem } from '@/components/entities/Category';
import { CategoryCreateEditDialog } from './CategoryCreateEditDialog/CategoryCreateEditDialog';

type Props = {
  categories: Category[];
  isPending: boolean;
};

export const CategoryBlock = ({ categories, isPending }: Props) => {
  const hasCategories = !!categories?.length;
  const title = hasCategories ? 'Ваши категории' : 'Нет категорий';
  const description = hasCategories
    ? 'Категории нужны чтобы группировать задачи'
    : 'Вы не создали ни одной категории, нажмите кнопку ниже, чтобы создать';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid md:grid-cols-2 gap-4'>
          {categories.map(category => (
            <CategoryItem
              category={category}
              key={category.id}
            />
          ))}
          {!isPending && <CategoryCreateEditDialog modeForm='CREATE' />}
          {isPending && <Spinner />}
        </div>
      </CardContent>
    </Card>
  );
};
