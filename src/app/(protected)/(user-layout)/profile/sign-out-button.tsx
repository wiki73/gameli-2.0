'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { ROUTES } from '@/src/consts';
import { signOut } from '@/src/lib/auth-client';

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(ROUTES.SIGN_IN);
          router.refresh();
        },
      },
    });
  };

  return (
    <Button
      className='w-fit'
      onClick={handleSignOut}
      size='sm'
      variant='destructive'
    >
      Выйти
    </Button>
  );
};
