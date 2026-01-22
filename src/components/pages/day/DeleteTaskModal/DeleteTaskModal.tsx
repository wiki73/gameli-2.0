import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '../../../../api/api';
import { useAuth } from '../../../../contexts/auth-context';

type Props = {
  id: string;
};

export const DeleteTaskModal = ({ id }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const deleteTaskMutation = useMutation({
    mutationFn: api.tasks.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id],
      });
      handleClose();
    },
  });

  const handleSubmit = () => {
    deleteTaskMutation.mutate({
      id,
    });
  };

  return (
    <Dialog
      onOpenChange={setOpen}
      open={open}
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
          <DialogTitle>Удалить задачу?</DialogTitle>
          <DialogDescription>
            Это действие нельзя будет отменить.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={deleteTaskMutation.isPending}
            onClick={handleSubmit}
            variant='destructive'
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
