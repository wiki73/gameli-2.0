import z from 'zod';

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 50;

export const taskFormSchema = z.object({
  name: z
    .string()
    .min(
      MIN_NAME_LENGTH,
      `Название должно содержать не менее ${String(MIN_NAME_LENGTH)} символов`,
    )
    .max(
      MAX_NAME_LENGTH,
      `Название должно содержать не более ${String(MAX_NAME_LENGTH)} символов`,
    ),
});

export type TaskFormType = z.infer<typeof taskFormSchema>;
