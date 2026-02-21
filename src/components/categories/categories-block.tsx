'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { Button } from '@ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Category } from '@/generated/prisma';
import { CategoriesList } from './categories-list';
import { CategoryCreateEditDialog } from './category-create-edit-dialog';

const ITEMS_PER_PAGE = 9;

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

export const CategoriesBlock = ({ categories }: Props) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  const currentCategories = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return categories.slice(start, start + ITEMS_PER_PAGE);
  }, [categories, page]);

  const hasCategories = categories.length > 0;

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{getTitle({ hasCategories })}</CardTitle>
        <CardDescription>{getDescription({ hasCategories })}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <CategoriesList categories={currentCategories} />

        {totalPages > 1 && (
          <div className='mt-4 flex items-center justify-between'>
            <Button
              disabled={page === 1}
              onClick={() => {
                setPage(p => Math.max(1, p - 1));
              }}
              size='icon'
              variant='outline'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>

            <span className='text-muted-foreground text-2xl '>
              {page}
            </span>

            <Button
              disabled={page === totalPages}
              onClick={() => {
                setPage(p => Math.min(totalPages, p + 1));
              }}
              size='icon'
              variant='outline'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        )}

        <CategoryCreateEditDialog />
      </CardContent>
    </Card>
  );
};
