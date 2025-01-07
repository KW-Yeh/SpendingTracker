import { Header } from '@/composites/Header';
import { PrepareData } from '@/composites/PrepareData';
import { SpendingProvider } from '@/context/SpendingProvider';
import { UserConfigProvider } from '@/context/UserConfigProvider';
import { GroupProvider } from '@/context/GroupProvider';
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
          <GroupProvider>
            <UserConfigProvider>
              <SpendingProvider>
                <Header />
                {children}
                <PrepareData />
              </SpendingProvider>
            </UserConfigProvider>
          </GroupProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
