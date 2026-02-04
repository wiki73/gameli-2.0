import { Skeleton } from '@/src/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='grid h-full w-full grid-cols-3 gap-8'>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}
