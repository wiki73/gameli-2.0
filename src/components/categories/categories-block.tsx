import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { CategoriesList } from './categories-list';
import { CategoryCreateEditDialog } from './category-create-edit-dialog';
import type { Category } from '../../../generated/prisma';

const getTitle = ({ hasCategories }: { hasCategories: boolean }) => {
  switch (true) {
    case !hasCategories:
      return 'Нет ни одной категории';
    default:
      return 'Список категорий';
  }
};

const getDescription = ({ hasCategories }: { hasCategories: boolean }) => {
  switch (true) {
    case !hasCategories:
      return 'Создайте новую категорию, нажав кнопку ниже';
    default:
      return 'Выберите категорию';
  }
};

type Props = {
  categories: Category[];
};

export const CategoriesBlock = ({ categories }: Props) => (
  <Card className='w-full'>
    <CardHeader>
      <CardTitle>{getTitle({ hasCategories: !!categories.length })}</CardTitle>
      <CardDescription>
        {getDescription({ hasCategories: !!categories.length })}
      </CardDescription>
    </CardHeader>
    <CardContent className='flex flex-col gap-4'>
      <CategoriesList categories={categories} />
      <CategoryCreateEditDialog />
    </CardContent>
  </Card>
);
