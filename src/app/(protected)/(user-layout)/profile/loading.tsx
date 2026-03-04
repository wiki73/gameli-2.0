import { Skeleton } from '@/src/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='flex h-full w-full max-w-6xl flex-[1_1_auto] flex-col gap-4'>
      <div>
        <Skeleton className='h-8 w-44' />
      </div>
      <div className='grid h-full min-h-[calc(100dvh-160px)] w-full auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 md:gap-8'>
        <div className='flex h-full flex-col gap-4 md:gap-8'>
          <Skeleton className='h-full w-full' />
          <Skeleton className='h-full w-full' />
          <Skeleton className='h-full w-full' />
        </div>
        <div className='flex h-full flex-col gap-4 md:gap-8'>
          <Skeleton className='h-full w-full' />
          <Skeleton className='h-full w-full' />
          <Skeleton className='h-full w-full' />
        </div>
      </div>
    </div>
  );
}
