import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import type { Category } from '@/api/categories/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { CategoryItem } from '@/components/entities/category-item';
import { Button } from '@/components/ui/button';
import { PAGE_SIZES, QUERY_KEY_TYPES } from '@/consts';
import { CategoryCreateEditDialog } from './category-create-edit-dialog';

type Props = {
  categories: Category[];
  isPending: boolean;
  dayId?: string;
  showPagination: boolean;
  categoriesPage: number;
  tasksPage: number;
  isFetching: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const CategoryBlock = ({
  categories,
  isPending,
  dayId,
  showPagination,
  categoriesPage,
  setPage,
  tasksPage,
  isFetching,
}: Props) => {
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
      <CardContent className='flex flex-col w-full gap-4'>
        <div className='grid md:grid-cols-2 gap-3'>
          {categories.map(category => (
            <CategoryItem
              categoriesPage={categoriesPage}
              category={category}
              dayId={dayId}
              key={category.id}
              tasksPage={tasksPage}
            />
          ))}
          {!isPending && (
            <CategoryCreateEditDialog
              categoriesPage={categoriesPage}
              modeForm='CREATE'
            />
          )}
          {isPending && <Spinner />}
        </div>
        {showPagination && (
          <div className='flex justify-between items-center'>
            <Button
              disabled={categoriesPage === 1}
              onClick={() => {
                setPage(p => p - 1);
              }}
              size='icon'
              variant='outline'
            >
              <ArrowLeftIcon />
            </Button>
            <span>
              Страница {categoriesPage}
              {isFetching && ' • обновление…'}
            </span>
            <Button
              disabled={
                categories.length < PAGE_SIZES[QUERY_KEY_TYPES.CATEGORIES]
              }
              onClick={() => {
                setPage(p => p + 1);
              }}
              size='icon'
              variant='outline'
            >
              <ArrowRightIcon />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
