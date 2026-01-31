'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@lib/auth-client';

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const res = await signIn.email({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });

    if (res.error) {
      setError(res.error.message || 'Something went wrong.');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <main className='mx-auto flex h-screen max-w-md flex-col items-center justify-center space-y-4 p-6 text-white'>
      <h1 className='text-2xl font-bold'>Sign In</h1>

      {error && <p className='text-red-500'>{error}</p>}

      <form
        className='space-y-4'
        onSubmit={handleSubmit}
      >
        <input
          className='w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2'
          name='email'
          placeholder='Email'
          required
          type='email'
        />
        <input
          className='w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2'
          name='password'
          placeholder='Password'
          required
          type='password'
        />
        <button
          className='w-full rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-200'
          type='submit'
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
