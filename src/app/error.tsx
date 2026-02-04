'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../components/ui/empty';
import { Button } from '../components/ui/button';

export default function ErrorPage() {
  return (
    <Empty>
      <EmptyMedia>
        <Cross1Icon className='size-8' />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Произошла ошибка</EmptyTitle>
        <EmptyDescription>Пожалуйста, попробуйте позже</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          className='w-full'
          onClick={() => {
            window.location.reload();
          }}
          variant='secondary'
        >
          Попробовать снова
        </Button>
      </EmptyContent>
    </Empty>
  );
}
