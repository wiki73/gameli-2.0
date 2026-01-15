import { useState } from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { DeleteCategoryModal } from '../pages/category/DeleteCategoryModal/DeleteCategoryModal';
import { getColorBySubjectLevel } from '../../constants/colors';
import { Button } from '../common/Button/Button';
import styles from './Category.module.css';

export const Category = ({ name, description, level, id }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const color = getColorBySubjectLevel(level);

  const handleEditButtonClick = () => {};

  const handleDeleteButtonClick = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <div
      className={styles.category}
      key={id}
      style={{ boxShadow: `0px 0px 12px var(${color})` }}
    >
      <div className={styles.categoryHeader}>
        <h3 className={styles.categoryName}>{name}</h3>
        <p className={styles.categoryDescription}>{description}</p>
      </div>
      <div className={styles.categoryFooter}>
        <div className={styles.categoryLevel}>Lvl. {level}</div>
        <div className={styles.categoryButtons}>
          <Button
            onClick={handleEditButtonClick}
            size='icon'
            variant='secondary'
          >
            <Pencil1Icon />
          </Button>
          <Button
            onClick={handleDeleteButtonClick}
            size='icon'
            variant='danger'
          >
            <TrashIcon />
          </Button>
          {isDeleteModalOpen ? (
            <DeleteCategoryModal
              id={id}
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
