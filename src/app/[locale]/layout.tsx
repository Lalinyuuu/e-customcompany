import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';
import { QueryProvider } from '@/lib/react-query/QueryProvider';
import '../../styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'E-Customs Company Master',
  description:
    'ระบบจัดการข้อมูลบริษัทผู้นำเข้า/ส่งออก สำหรับงานศุลกากร - Company Management System for Import/Export Customs Operations',
  keywords: [
    'customs',
    'company management',
    'import',
    'export',
    'thailand',
    'ศุลกากร',
    'บริษัท',
    'นำเข้า',
    'ส่งออก',
  ],
  authors: [{ name: 'E-Customs Service' }],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'th' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen overflow-x-hidden scroll-smooth`}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ErrorBoundary>{children}</ErrorBoundary>
              <Toaster position="top-right" richColors closeButton />
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
