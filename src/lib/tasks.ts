import { api } from '@/api/api';
import { getLevelByExperience, OFFLINE_MUTATIONS_TYPES } from '@/consts';
import { enqueueMutation } from '@/contexts/query/persist';

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
  userId: string;
  userCurrentExperience: number;
  earnedExperience: number;
}) => {
  if (!navigator.onLine) {
    await enqueueMutation({
      type: OFFLINE_MUTATIONS_TYPES.COMPLETE_TASK,
      payload: {
        taskId,
        categoryId,
        userId,
        userCurrentExperience,
        categoryCurrentExperience,
        earnedExperience,
      },
    });
    return { offline: true };
  }

  const newCategoryExperience = categoryCurrentExperience + earnedExperience;
  const newUserExperience = userCurrentExperience + earnedExperience;
  const categoryLevel = getLevelByExperience(newCategoryExperience);
  const userLevel = getLevelByExperience(newUserExperience);

  await Promise.all([
    api.tasks.update({
      id: taskId,
      data: {
        is_done: true,
      },
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

  return { offline: false };
};
