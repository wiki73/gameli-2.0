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
import { getQueryKey, QUERY_KEY_TYPES } from '@/consts';
import { useAuth } from '@/contexts/auth';
import { api } from '@/api/api';

type Props = {
  id: string;
  dayId?: string;
  tasksPage: number;
};

export const TaskDeleteDialog = ({ id, dayId, tasksPage }: Props) => {
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
        queryKey: getQueryKey({
          type: QUERY_KEY_TYPES.TASKS,
          payload: {
            userId: user?.id ?? '',
            dayId: dayId ?? '',
            page: tasksPage,
          },
        }),
        exact: false,
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
