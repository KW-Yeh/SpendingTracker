import { BottomNav } from '@/composites/BottomNav';
import { DataSyncToast } from '@/composites/DataSyncToast';
import Footer from '@/composites/Footer';
import { Header } from '@/composites/Header';
import { PrepareData } from '@/composites/PrepareData';
import { DateProvider } from '@/context/DateProvider';
import { FavoriteCategoriesProvider } from '@/context/FavoriteCategoriesProvider';
import { GroupProvider } from '@/context/GroupProvider';
import { BudgetProvider } from '@/context/BudgetProvider';
import { SpendingProvider } from '@/context/SpendingProvider';
import { UserConfigProvider } from '@/context/UserConfigProvider';
import type { Viewport } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

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
      </head>
      <body>
        <SessionProvider>
          <DateProvider>
            <GroupProvider>
              <UserConfigProvider>
                <FavoriteCategoriesProvider>
                  <SpendingProvider>
                    <BudgetProvider>
                      <Header />
                      {children}
                      {modal}
                      <PrepareData />
                      <DataSyncToast />
                    </BudgetProvider>
                  </SpendingProvider>
                </FavoriteCategoriesProvider>
              </UserConfigProvider>
            </GroupProvider>
          </DateProvider>
        </SessionProvider>
        <Footer />
        <BottomNav />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
