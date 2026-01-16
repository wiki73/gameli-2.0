import { useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { Spinner } from '../../common/spinner/Spinner';
import { Category } from '../../entities/Category';
import { CreateCategoryModal } from '../../pages/category/CreateCategoryModal/CreateCategoryModal';
import styles from './CategoryList.module.pcss';
import { Button } from '@/components/common/Button/Button';

export const CategoryList = ({ categories, isPending }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  return (
    <>
      <div className={styles.categories}>
        {!!categories?.length &&
          categories?.map(category => (
            <Category
              {...category}
              key={category.id}
            />
          ))}
        {!isPending && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant='secondary'
          >
            <PlusIcon
              height={32}
              width={32}
            />
          </Button>
        )}
        {isPending && <Spinner />}
      </div>
      {isCreateModalOpen ? (
        <CreateCategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      ) : null}
    </>
  );
};
