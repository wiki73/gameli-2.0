'use client';

import { useRouter } from 'next/navigation';
import { signUp, signUpFormSchema } from '@lib/auth-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { useTransition } from 'react';
import Image from 'next/image';
import { ROUTES } from '@/src/consts';
import type { SignUpFormType } from '@lib/auth-client';

const USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL =
  'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL';

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const { handleSubmit, control, setError, clearErrors } = form;

  const handleToSignInClick = () => {
    router.push(ROUTES.SIGN_IN);
  };

  const onSubmit: SubmitHandler<SignUpFormType> = data => {
    startTransition(async () => {
      try {
        const res = await signUp.email(data);
        if (res.error) {
          if (res.error.code === USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL) {
            setError('root', {
              message: 'Пользователь с таким логином уже существует',
            });
          } else {
            setError('root', {
              message: res.error.message || 'Что-то пошло не так',
            });
          }
        } else {
          router.push(ROUTES.MAIN);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError('root', {
            message: error.message || 'Что-то пошло не так',
          });
        }
      }
    });
  };

  const isButtonDisabled = !form.formState.isValid || isPending;

  return (
    <Form {...form}>
      <form
        className='fixed inset-0 flex items-center justify-center'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Image
          alt='Gameli logo'
          className='fixed top-8 left-8'
          height={64}
          src='/icon1.png'
          width={64}
        />
        <Card className='w-full max-w-xl'>
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              Введите имя, логин и пароль чтобы войти
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-1'>
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={e => {
                        clearErrors();
                        field.onChange(e);
                      }}
                      placeholder='Имя'
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Почта</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={e => {
                        clearErrors();
                        field.onChange(e);
                      }}
                      placeholder='Почта'
                      type='email'
                    />
                  </FormControl>
                  <FormDescription />
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
                      {...field}
                      onChange={e => {
                        clearErrors();
                        field.onChange(e);
                      }}
                      placeholder='Пароль'
                      type='password'
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className='text-destructive'>
              {form.formState.errors.root?.message}
            </p>
          </CardContent>
          <CardFooter>
            <Button disabled={isButtonDisabled}>Зарегестрироваться</Button>
            <Button
              onClick={handleToSignInClick}
              variant='link'
            >
              Войти
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
