import { type Metadata } from 'next';
import { Geist } from 'next/font/google';
import { ThemeProvider } from '@components/theme-provider';
import { Toaster } from '@ui/sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import '@styles/globals.css';

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
      <body className='flex h-full min-h-dvh w-full flex-col items-center'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          disableTransitionOnChange
          enableSystem
        >
          <div className='flex h-full min-h-dvh w-full flex-col items-center gap-4 pb-24 sm:p-0 md:pb-4'>
            {children}
          </div>
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
