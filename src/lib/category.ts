import z from 'zod';
import { MAX_CATEGORY_RATIO, MIN_CATEGORY_RATIO } from '@/consts';

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

export const categoryFormSchema = z.object({
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
  description: z
    .string()
    .max(
      MAX_DESCRIPTION_LENGTH,
      `Описание должно содержать не более ${String(MAX_DESCRIPTION_LENGTH)} символов`,
    )
    .optional(),
  ratio: z.number().min(MIN_CATEGORY_RATIO).max(MAX_CATEGORY_RATIO),
});

export type CategoryFormType = z.infer<typeof categoryFormSchema>;
