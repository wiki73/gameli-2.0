import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { api } from '@/api/api';
import { getQueryKey, QUERY_KEY_TYPES } from '@/consts';
import { useAuth } from '@/contexts/auth';

type Props = {
  id: string;
  dayId?: string;
};

export const CategoryDeleteDialog = ({ id, dayId }: Props) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: api.categories.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.CATEGORIES,
          payload: { userId: user?.id ?? '' },
        }),
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.TASKS,
          payload: { userId: user?.id ?? '', dayId: dayId ?? '' },
        }),
      });
      handleClose();
    },
  });

  const isButtonDisabled = useMemo(
    () => deleteMutation.isPending || !id,
    [deleteMutation.isPending, id],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    deleteMutation.mutate({
      id,
    });
  };

  return (
    <Dialog
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button
          onClick={handleOpen}
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
            {deleteMutation.isPending ? <Spinner /> : null}
            Удалить категорию
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
