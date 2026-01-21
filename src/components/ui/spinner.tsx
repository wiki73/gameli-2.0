import { Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Spinner = ({ className, ...props }: React.ComponentProps<'svg'>) => (
  <Loader2Icon
    aria-label='Loading'
    className={cn('size-4 animate-spin', className)}
    role='status'
    {...props}
  />
);

export { Spinner };

export const FullScreenSpinner = () => (
  <div className='fixed inset-0 z-10 flex items-center justify-center'>
    <Spinner className='size-16' />
  </div>
);
