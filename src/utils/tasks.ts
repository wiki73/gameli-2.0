import { api } from '@/api/api';
import { getLevelByExperience } from './level';

export const completeTask = async ({
  taskId,
  categoryId,
  userId,
  userCurrentExperience,
  earnedExperience,
  categoryCurrentExperience,
}: {
  taskId: string;
  categoryId: string;
  categoryCurrentExperience: number;
  categoryCurrentLevel: number;
  userId: string;
  userCurrentExperience: number;
  userCurrentLevel: number;
  earnedExperience: number;
}) => {
  const newCategoryExperience = categoryCurrentExperience + earnedExperience;
  const newUserExperience = userCurrentExperience + earnedExperience;
  const categoryLevel = getLevelByExperience(newCategoryExperience);
  const userLevel = getLevelByExperience(newUserExperience);

  return Promise.all([
    api.tasks.update({
      id: taskId,
      is_done: true,
    }),
    api.categories.update({
      id: categoryId,
      data: {
        experience: newCategoryExperience,
        level: categoryLevel,
      },
    }),
    api.auth.user.update({
      userId,
      data: {
        exp: newUserExperience,
        level: userLevel,
      },
    }),
  ]);
};
