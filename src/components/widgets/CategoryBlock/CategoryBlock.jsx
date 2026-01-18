import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api/api';
import { useAuth } from '../../../contexts/auth-context';
import { Card } from '../../common/Card/Card';
import { CategoryList } from '../../widgets/CategoryList/CategoryList';
import styles from './CategoryBlock.module.css';

export const CategoryBlock = () => {
  const { user } = useAuth();

  const { data: categories, isPending } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: () => api.categories.getMany({ userId: user?.id }),
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
