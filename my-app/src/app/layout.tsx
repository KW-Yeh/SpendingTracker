import { Header } from '@/composites/Header';
import { GroupProvider } from '@/context/GroupProvider';
import { SpendingProvider } from '@/context/SpendingProvider';
import { UserConfigProvider } from '@/context/UserConfigProvider';
import type { Viewport } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
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
                {modal}
              </SpendingProvider>
            </UserConfigProvider>
          </GroupProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
