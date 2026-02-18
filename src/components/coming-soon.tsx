import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { Button } from '@ui/button';
import Link from 'next/link';
import { ROUTES } from '../consts';

export const ComingSoon = () => (
  <div className='fixed inset-0 flex items-center justify-center p-4'>
    <Card className='w-full max-w-xl'>
      <CardHeader>
        <CardTitle>Страница в разработке</CardTitle>
        <CardDescription>Скоро появится новый функционал</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          asChild
          variant='link'
        >
          <Link href={`${ROUTES.MAIN}?tab=week`}>На главную</Link>
        </Button>
      </CardFooter>
    </Card>
  </div>
);
