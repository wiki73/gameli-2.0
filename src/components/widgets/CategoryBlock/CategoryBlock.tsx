import { Category } from '@/api/categories/types';
import { Card } from '../../common/Card/Card';
import { CategoryList } from '../CategoryList/CategoryList';
import styles from './CategoryBlock.module.css';

type Props = {
  categories: Category[];
  isPending: boolean;
};

export const CategoryBlock = ({ categories, isPending }: Props) => (
  <Card className={styles.page}>
    <h1 className={styles.pageTitle}>Категории</h1>
    {!categories?.length && (
      <div className={styles.noCategoriesMessage}>
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
