'use client';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

export const CategoryCreateEditDialog = () => {
  const form = useForm();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>Description</DialogDescription>
          <Form {...form}>
            <form className='flex flex-col gap-4'>category create form</form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
