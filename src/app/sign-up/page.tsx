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
import { ROUTES } from '@/src/consts';
import type { SignUpFormType } from '@lib/auth-client';

export default function SignInPage() {
  const router = useRouter();

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, control, setError } = form;

  const handleToSignInClick = () => {
    router.push(ROUTES.SIGN_IN);
  };

  const onSubmit: SubmitHandler<SignUpFormType> = async data => {
    const res = await signUp.email(data);

    if (res.error) {
      setError('root', {
        message: res.error.message || 'Something went wrong.',
      });
    } else {
      router.push(ROUTES.MAIN);
    }
  };

  return (
    <Form {...form}>
      <form
        className='fixed inset-0 flex items-center justify-center'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card className='w-full max-w-xl'>
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              Введите имя, логин и пароль чтобы войти
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
                  <FormLabel>Почта</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Пароль'
                      type='password'
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button>Зарегестрироваться</Button>
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
