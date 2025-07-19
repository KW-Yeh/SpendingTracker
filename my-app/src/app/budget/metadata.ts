import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '預算管理',
  description: '預算安排與追蹤',
  authors: { name: 'KW' },
  openGraph: {
    title: '預算管理',
    description: '預算安排與追蹤',
    url: 'https://gs-db.vercel.app/budget',
    images: [
      {
        url: '/Spending-512.png',
        width: 512,
        height: 512,
      },
    ],
  },
};
