import { createAuthClient } from 'better-auth/react';
import z from 'zod';
import {
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../consts';

export const { signIn, signUp, signOut, useSession } = createAuthClient();

export const signInFormSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type SignInFormType = z.infer<typeof signInFormSchema>;

export const signUpFormSchema = z.object({
  name: z.string().min(NAME_MIN_LENGTH, {
    error: 'Имя должно содержать не менее 3 символов',
  }),
  email: z.email(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, {
      error: `Пароль должен содержать не менее ${String(PASSWORD_MIN_LENGTH)} символов`,
    })
    .max(PASSWORD_MAX_LENGTH, {
      error: `Пароль должен содержать не более ${String(PASSWORD_MAX_LENGTH)} символов`,
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
      error:
        'Пароль должен содержать заглавную, строчную букву, цифру и спецсимвол',
    }),
});

export type SignUpFormType = z.infer<typeof signUpFormSchema>;
