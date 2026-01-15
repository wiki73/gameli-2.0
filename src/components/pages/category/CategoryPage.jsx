import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { useAuth } from '../../../contexts/auth-context';
import { CategoryList } from '../../widgets/CategoryList/CategoryList';
import { Card } from '../../common/Card/Card';
import styles from './CategoryPage.module.css';

export const CategoryPage = () => {
  const { user } = useAuth();

  const { data: categories, isPending } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: () => api.getCategories(user.id),
    enabled: !!user?.id,
  });

  return (
    <Card className={styles.page}>
      <h1 className={styles.pageTitle}>Категории</h1>
      <CategoryList
        categories={categories}
        isPending={isPending}
      />
    </Card>
  );
};
