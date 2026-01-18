import { api } from '@/api/api';

export const completeTask = async ({
  taskId,
  categoryId,
  userId,
  experience,
}: {
  taskId: string;
  categoryId: string;
  userId: string;
  experience: number;
}) =>
  Promise.all([
    api.tasks.update({
      id: taskId,
      is_done: true,
    }),
    api.categories.update({ id: categoryId, experience }),
    api.auth.user.update({
      userId,
      data: {
        exp: experience,
      },
    }),
  ]);
