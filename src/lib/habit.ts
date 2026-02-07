import z from 'zod';

export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 200;

export const habitFormSchema = z.object({
  title: z
    .string()
    .min(
      TITLE_MIN_LENGTH,
      `Название должно содержать не менее ${String(TITLE_MIN_LENGTH)} символов`,
    )
    .max(
      TITLE_MAX_LENGTH,
      `Название должно содержать не более ${String(TITLE_MAX_LENGTH)} символов`,
    ),
  description: z
    .string()
    .max(
      DESCRIPTION_MAX_LENGTH,
      `Описание должно содержать не более ${String(DESCRIPTION_MAX_LENGTH)} символов`,
    )
    .optional(),
});

export type HabitFormType = z.infer<typeof habitFormSchema>;
