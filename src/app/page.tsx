'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className='flex h-screen items-center justify-center bg-neutral-950 text-white'>
      <div className='flex gap-4'>
        <button
          className='rounded-md bg-white px-6 py-2 font-medium text-black hover:bg-gray-200'
          onClick={() => {
            router.push('/sign-up');
          }}
        >
          Sign Up
        </button>
        <button
          className='rounded-md border border-white px-6 py-2 font-medium text-white hover:bg-neutral-800'
          onClick={() => {
            router.push('/sign-in');
          }}
        >
          Sign In
        </button>
      </div>
    </main>
  );
}
