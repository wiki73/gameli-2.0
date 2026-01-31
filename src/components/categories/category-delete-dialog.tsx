'use client';

import { useMemo, useState, useTransition } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import { Button } from '@ui/button';
import { Spinner } from '@ui/spinner';
import { deleteCategory } from '@app/actions/category';

type Props = {
  id: string;
};

export const CategoryDeleteDialog = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isButtonDisabled = useMemo(() => isPending || !id, [isPending, id]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await deleteCategory({ id });
        setOpen(false);
        toast.success('Категория сохранена');
      } catch (e: unknown) {
        toast.error('Ошибка сохранения категории', {
          description: e instanceof Error ? e.message : '',
        });
      }
    });
  };

  return (
    <Dialog
      onOpenChange={setOpen}
      open={open}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          size='icon'
          variant='destructive'
        >
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить категорию</DialogTitle>
          <DialogDescription>
            С категорией также удаляться все связанные задачи. Это действие
            необратимо.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Button
            disabled={isButtonDisabled}
            type='submit'
            variant='destructive'
          >
            {isPending && <Spinner />}
            Удалить категорию
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
