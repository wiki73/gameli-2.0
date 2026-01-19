import { api } from '@/api/api';
import { getExperienceByLevel } from './level';

export const completeTask = async ({
  taskId,
  categoryId,
  userId,
  userCurrentExperience,
  userCurrentLevel,
  earnedExperience,
  categoryCurrentExperience,
  categoryCurrentLevel,
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
  let categoryLevel = categoryCurrentLevel;
  let userLevel = userCurrentLevel;
  const newCategoryExperience = categoryCurrentExperience + earnedExperience;
  const newUserExperience = userCurrentExperience + earnedExperience;

  if (newCategoryExperience >= getExperienceByLevel(categoryLevel + 1)) {
    categoryLevel++;
  }

  if (newUserExperience >= getExperienceByLevel(userLevel + 1)) {
    userLevel++;
  }

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
