import { auth, signIn } from '@/auth';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { LineIcon } from '@/components/icons/LineIcon';
import { redirect } from 'next/navigation';
import { HTMLAttributes, ReactNode } from 'react';

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
    <div className="mx-auto mt-20 flex max-w-175 flex-1 flex-col items-center justify-start gap-6">
      <h1 className="text-2xl font-bold">歡迎使用記帳追蹤</h1>
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <SocialButton
          icon={<GoogleIcon className="size-5" />}
          type="Google"
          onClick={handleLoginGoogle}
          className="text-background bg-red-500 hover:bg-red-600"
        />
        <SocialButton
          icon={<LineIcon className="size-5" />}
          type="Line"
          onClick={handleLoginLine}
          className="text-background bg-green-500 hover:bg-green-600"
        />
      </div>
    </div>
  );
}

interface SocialButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  type: string;
}

const SocialButton = (props: SocialButtonProps) => {
  const { onClick, className = '', icon, type, ...legacy } = props;
  return (
    <button
      onClick={onClick}
      className={`flex w-60 items-center justify-center gap-3 rounded-full px-6 py-3 transition-colors ${className}`}
      {...legacy}
    >
      <span className="aspect-square">{icon}</span>
      <p className="text-center text-sm transition-all sm:text-base">
        透過 <strong className="font-bold">{type}</strong> 登入
      </p>
    </button>
  );
};
