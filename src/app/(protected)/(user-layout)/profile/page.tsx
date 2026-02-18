import { Card, CardDescription, CardHeader, CardTitle } from '@ui/card';
import { headers } from 'next/headers';
import { PersonIcon } from '@radix-ui/react-icons';
import { auth } from '@/src/server/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { SignOutButton } from './sign-out-button';

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const { name, email, image } = session?.user ?? {};

  return (
    <Card className='w-full max-w-3xl'>
      <CardHeader>
        <Avatar>
          <AvatarImage src={image ?? ''} />
          <AvatarFallback>
            <PersonIcon />
          </AvatarFallback>
        </Avatar>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{email}</CardDescription>
        <SignOutButton />
      </CardHeader>
    </Card>
  );
}
