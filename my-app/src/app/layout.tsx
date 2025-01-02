import { Header } from '@/composites/Header';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '消費追蹤',
  description: '幫助記賬跟分析花費',
  authors: { name: 'KW' },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
