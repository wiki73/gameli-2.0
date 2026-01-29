import { type Metadata } from 'next';
import { Geist } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'Gameli',
  description: 'Геймификация задач и проектов',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={geist.variable}
      lang='ru'
      suppressHydrationWarning
    >
      <body className='flex h-full min-h-dvh w-full flex-col items-center p-4'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          disableTransitionOnChange
          enableSystem
        >
          <div className='flex h-full w-full max-w-3xl flex-col items-center gap-4'>
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
