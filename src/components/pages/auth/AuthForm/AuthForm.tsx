import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { api } from '@/api/api';
import type { AuthError } from '@supabase/supabase-js';

const TEXTS = {
  LOGIN: {
    TITLE: 'Войти',
    BTN_PRIMARY: 'Войти',
    BTN_SECONDARY: 'К регистрации',
  },
  REGISTER: {
    TITLE: 'Регистрация',
    BTN_PRIMARY: 'Зарегистрироваться',
    BTN_SECONDARY: 'К входу',
  },
  LABEL_NAME: 'Имя',
  LABEL_EMAIL: 'Почта',
  LABEL_PASSWORD: 'Пароль',
};

const MIN_PASSWORD_LENGTH = 6;

type Mode = 'LOGIN' | 'REGISTER';

const formSchema = z.object({
  name: z.string().optional(),
  email: z.email('Некорректный формат почты'),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, 'Пароль должен содержать минимум 6 символов'),
});

type FormData = z.infer<typeof formSchema>;

export const AuthForm = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>(
    (searchParams.get('mode') as Mode) ?? 'LOGIN',
  );
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { control, handleSubmit, clearErrors, setError, formState } = form;

  const isLogin = mode === 'LOGIN';

  const loginMutation = useMutation({
    mutationFn: api.auth.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err: AuthError) => {
      if (err.code === 'invalid_credentials') {
        setError('root', { message: 'Неверный логин или пароль' });
      } else {
        setError('root', { message: 'Ошибка авторизации' });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: api.auth.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: err => {
      setError('root', { message: err.message });
    },
  });

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const isButtonDisabled = useMemo(
    () => !formState.isValid || isLoading,
    [formState.isValid, isLoading],
  );

  const onSubmit: SubmitHandler<FormData> = data => {
    clearErrors();

    if (isLogin) {
      loginMutation.mutate({
        email: data.email,
        password: data.password,
      });
    } else {
      registerMutation.mutate(data);
    }
  };

  const handleSwitchMode = () => {
    setMode(prev => {
      setSearchParams({ mode: prev === 'LOGIN' ? 'REGISTER' : 'LOGIN' });
      return prev === 'LOGIN' ? 'REGISTER' : 'LOGIN';
    });
  };

  return (
    <Form {...form}>
      <form
        className='max-w-100 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle>{TEXTS[mode].TITLE}</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            {!isLogin && (
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='name'
                        id='name'
                        placeholder={TEXTS.LABEL_NAME}
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Почта</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='email'
                      id='email'
                      placeholder={TEXTS.LABEL_EMAIL}
                      type='email'
                      {...field}
                      onChange={e => {
                        clearErrors('root');
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='password'
                      id='password'
                      placeholder={TEXTS.LABEL_PASSWORD}
                      type='password'
                      {...field}
                      onChange={e => {
                        clearErrors('root');
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p
              className='text-destructive text-sm'
              data-slot='form-message'
            >
              {formState.errors.root?.message}
            </p>
          </CardContent>
          <CardFooter className='flex flex-col gap-2 w-full'>
            <Button
              className='w-full'
              disabled={isButtonDisabled}
              type='submit'
            >
              {isLoading && <Spinner />}
              {TEXTS[mode].BTN_PRIMARY}
            </Button>
            <Button
              className='w-full'
              onClick={handleSwitchMode}
              type='button'
              variant='secondary'
            >
              {TEXTS[mode].BTN_SECONDARY}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
