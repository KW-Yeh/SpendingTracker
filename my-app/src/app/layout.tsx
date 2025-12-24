import { BottomNav } from '@/composites/BottomNav';
import Footer from '@/composites/Footer';
import { Header } from '@/composites/Header';
import { PrepareData } from '@/composites/PrepareData';
import { DateProvider } from '@/context/DateProvider';
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
    <html lang="zh-Hant-TW">
      <head>
        <title></title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionProvider>
          <DateProvider>
            <GroupProvider>
              <UserConfigProvider>
                <SpendingProvider>
                  <Header />
                  {children}
                  {modal}
                  <PrepareData />
                </SpendingProvider>
              </UserConfigProvider>
            </GroupProvider>
          </DateProvider>
        </SessionProvider>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
