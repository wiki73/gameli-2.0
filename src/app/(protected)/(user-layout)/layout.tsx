import { Header } from '@components/header';

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='flex h-full min-h-dvh w-full flex-col items-center gap-4 p-4 pb-24 md:pb-4'>
      <Header />
      {children}
    </div>
  );
}
