import { Cross1Icon } from '@radix-ui/react-icons';
import Link from 'next/link';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../components/ui/empty';
import { Button } from '../components/ui/button';
import { ROUTES } from '../consts';

export default function NotFoundPage() {
  return (
    <Empty>
      <EmptyMedia>
        <Cross1Icon className='size-8' />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Страница не найдена</EmptyTitle>
        <EmptyDescription>Попробуйте поискать что-нибудь еще</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          asChild
          className='w-full'
          variant='secondary'
        >
          <Link href={ROUTES.CALENDAR}>На главную</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
