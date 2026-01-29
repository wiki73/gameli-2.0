'use client';

import { signOut, useSession } from '@/lib/auth-client';

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  const { user } = session;

  return (
    <main className='mx-auto flex h-screen max-w-md flex-col items-center justify-center space-y-4 p-6 text-white'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <p>Welcome, {user.name || 'User'}!</p>
      <p>Email: {user.email}</p>
      <button
        className='w-full rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-200'
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </main>
  );
}
