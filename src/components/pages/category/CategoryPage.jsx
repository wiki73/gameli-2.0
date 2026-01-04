import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import { useAuth } from '../../../contexts/auth-context';
import { getColorBySubjectLevel } from '../../../constants/colors';
import styles from './CategoryPage.module.css';
import { CreateCategoryModal } from './CreateCategoryModal/CreateCategoryModal';

export const CategoryPage = () => {
  const { user } = useAuth();
  const [openModalWindowCreate, setOpenModalWindowCreate] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: () => api.getCategories(user.id),
    enabled: !!user?.id,
  });

  const renderCategory = ({ id, name, description, level }) => {
    const color = getColorBySubjectLevel(level);

    return (
      <div
        className={styles.category}
        key={id}
      >
        <h3 className={styles.categoryName}>{name}</h3>
        <p className={styles.categoryDescription}>{description}</p>
        <div
          className={styles.categoryLevel}
          style={{
            border: `1px solid ${color}`,
            boxShadow: `0 0 10px ${color}, inset 0 0 5px ${color}`,
          }}
        >
          {level}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Категории</h1>
        <button
          className={styles.createButton}
          onClick={() => setOpenModalWindowCreate(true)}
          type='button'
        >
          Создать категорию
        </button>
      </div>

      <div className={styles.categories}>{categories?.map(renderCategory)}</div>
      {openModalWindowCreate ? (
        <CreateCategoryModal
          isOpen={openModalWindowCreate}
          onClose={() => setOpenModalWindowCreate(false)}
        />
      ) : null}
    </div>
  );
};
