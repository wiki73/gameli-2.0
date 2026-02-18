'use client';

import { useRouter } from 'next/navigation';
import { signIn, signInFormSchema } from '@lib/auth-client';
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
import Image from 'next/image';
import { ROUTES } from '@/src/consts';
import type { SignInFormType } from '@lib/auth-client';

const INVALID_EMAIL_OR_PASSWORD = 'INVALID_EMAIL_OR_PASSWORD';

export default function SignInPage() {
  const router = useRouter();

  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const { handleSubmit, control, setError, clearErrors } = form;

  const handleToSignUpClick = () => {
    router.push(ROUTES.SIGN_UP);
  };

  const onSubmit: SubmitHandler<SignInFormType> = async data => {
    const res = await signIn.email(data);

    if (res.error) {
      if (res.error.code === INVALID_EMAIL_OR_PASSWORD) {
        setError('root', {
          message: 'Неверный логин или пароль',
        });
      } else {
        setError('root', {
          message: res.error.message || 'Что-то пошло не так',
        });
      }
    } else {
      router.push(`${ROUTES.MAIN}?tab=week`);
    }
  };

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
            <CardTitle>Вход</CardTitle>
            <CardDescription>
              Введите логие и пароль чтобы войти
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-1'>
            <div className='flex flex-col gap-1'>
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
            </div>
            <p className='text-destructive'>
              {form.formState.errors.root?.message}
            </p>
          </CardContent>
          <CardFooter>
            <Button>Войти</Button>
            <Button
              onClick={handleToSignUpClick}
              variant='link'
            >
              Зарегестрироваться
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
