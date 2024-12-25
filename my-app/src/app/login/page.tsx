import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  const handleLoginGoogle = async () => {
    'use server';
    await signIn('google');
  };
  const handleLoginLine = async () => {
    'use server';
    await signIn('line');
  };

  if (session?.user) redirect('/');

  return (
    <div className="mx-auto mt-20 flex w-full max-w-96 flex-1 flex-col items-center justify-center gap-6">
      <div className="divide-y divide-text rounded-2xl border border-solid border-text shadow">
        <h1 className="p-6 text-xl font-bold">登入</h1>
        <div className="flex w-full flex-col items-center gap-4 p-6">
          <p className="mb-4">選擇一種登入方式並開始你的消費紀錄！</p>
          <button
            onClick={handleLoginGoogle}
            className="w-full rounded-md bg-red-300 px-6 py-4 font-bold"
          >
            登入 Google 帳號
          </button>
          <button
            onClick={handleLoginLine}
            className="w-full rounded-md bg-green-300 px-6 py-4 font-bold"
          >
            登入 Line 帳號
          </button>
        </div>
      </div>
    </div>
  );
}
