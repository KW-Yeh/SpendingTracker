import { LXGW_WenKai_TC } from 'next/font/google';
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

const fonts = LXGW_WenKai_TC({
  weight: ['300', '400', '700'],
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={fonts.className}>
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
      </body>
    </html>
  );
}
