import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { Category } from '@/api/categories/types';
import { getColorBySubjectLevel } from '../../constants/colors';
import { DeleteCategoryModal } from '../widgets/CategoryBlock/DeleteCategoryModal/DeleteCategoryModal';
import { TypographySmall } from '../ui/typography-small';
import { CreateCategoryModal } from '../widgets/CategoryBlock/CreateCategoryModal/CreateCategoryModal';

type Props = {
  category: Category;
};

export const CategoryItem = ({ category }: Props) => (
  <Card
    style={{
      boxShadow: `0px 0px 12px var(${getColorBySubjectLevel(category.level)})`,
    }}
  >
    <CardHeader>
      <CardTitle className='line-clamp-2'>{category.name}</CardTitle>
      <CardDescription className='line-clamp-3'>
        {category.description}
      </CardDescription>
    </CardHeader>
    <CardContent className='flex items-center justify-between gap-4'>
      <TypographySmall>Lvl. {category.level}</TypographySmall>
      <div className='flex items-center gap-2'>
        <CreateCategoryModal
          category={category}
          modeForm='EDIT'
        />

        <DeleteCategoryModal id={category.id} />
      </div>
    </CardContent>
  </Card>
);
