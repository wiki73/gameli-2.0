import { Spinner } from '../../common/spinner/Spinner';
import { Category } from '../../entities/Category';
import { CreateCategoryModal } from '../CategoryBlock/CreateCategoryModal/CreateCategoryModal';
import styles from './CategoryList.module.pcss';

export const CategoryList = ({ categories, isPending }) => (
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  <div className={styles.categories}>
    {!!categories?.length &&
      categories?.map(category => (
        <Category
          {...category}
          key={category.id}
        />
      ))}
    {!isPending && <CreateCategoryModal modeForm='CREATE' />}
    {isPending && <Spinner />}
  </div>
);
