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

type Props = {
  id: string;
};

export const DeleteCategoryModal = ({ id }: Props) => {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ['categories'], exact: false });
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
