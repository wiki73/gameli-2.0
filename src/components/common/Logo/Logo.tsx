import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'fixed inset-0 flex items-center  justify-center flex-col gap-4 w-full p-4 animate-fade-in-scale',
      className,
    )}
  >
    <img
      alt='Gameli'
      className='max-w-100 w-full aspect-square'
      src='/images/icon-512x512.png'
    />
    <h1 className='uppercase'>Gameli 0.0.1 Alpha</h1>
  </div>
);
