'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useSession } from '@/lib/auth-client';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in');
    }
  }, [isPending, session, router]);

  if (isPending && !session) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  return children;
}
