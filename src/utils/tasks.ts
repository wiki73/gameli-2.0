import { api } from '@/api/api';

export const completeTask = async ({
  taskId,
  categoryId,
  userId,
  expirence,
}: {
  taskId: string;
  categoryId: string;
  userId: string;
  expirence: number;
}) =>
  Promise.all([
    api.tasks.update({
      id: taskId,
      is_done: true,
    }),
    api.categories.update({ id: categoryId, expirence }),
    api.auth.user.update({
      userId,
      data: {
        exp: expirence,
      },
    }),
  ]);
