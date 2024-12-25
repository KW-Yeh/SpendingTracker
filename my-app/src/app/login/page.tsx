import { auth, signIn } from '@/auth';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { LineIcon } from '@/components/icons/LineIcon';
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
    <div className="items-ceenter mx-auto mt-20 flex w-full max-w-96 flex-1 flex-col justify-start gap-6">
      <div className="divide-y divide-text rounded-2xl border border-solid border-text shadow">
        <h1 className="p-6 text-xl font-bold">選擇登入方式</h1>
        <div className="flex w-full flex-col items-center gap-4 p-6">
          <p className="mb-4">選擇一種登入方式並開始你的消費紀錄！</p>
          <button
            onClick={handleLoginGoogle}
            className="grid w-full grid-cols-3 gap-2 rounded-md bg-red-300 py-4 pl-6 pr-14 font-bold transition-colors hover:bg-red-200"
          >
            <span className="col-span-1 flex h-full items-center justify-end">
              <GoogleIcon className="size-4" />
            </span>
            <span className="col-span-2 h-full text-start">
              登入 Google 帳號
            </span>
          </button>
          <button
            onClick={handleLoginLine}
            className="grid w-full grid-cols-3 gap-2 rounded-md bg-green-300 py-4 pl-6 pr-14 font-bold transition-colors hover:bg-green-200"
          >
            <span className="col-span-1 flex h-full items-center justify-end">
              <LineIcon className="size-4" />
            </span>
            <span className="col-span-2 h-full text-start">登入 Line 帳號</span>
          </button>
        </div>
      </div>
    </div>
  );
}
