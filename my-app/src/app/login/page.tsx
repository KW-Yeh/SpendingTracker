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
      <div className="flex items-center gap-4">
        <SocialButton
          icon={<GoogleIcon className="size-5" />}
          type="Google"
          onClick={handleLoginGoogle}
          className="bg-red-500 text-background hover:bg-red-600"
        />
        <SocialButton
          icon={<LineIcon className="size-5" />}
          type="Line"
          onClick={handleLoginLine}
          className="bg-green-500 text-background hover:bg-green-600"
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
      className={`group flex w-fit items-center rounded-full transition-colors ${className}`}
      {...legacy}
    >
      <span className="aspect-square p-4">{icon}</span>
      <p className="w-0 overflow-hidden whitespace-nowrap text-center text-sm transition-all duration-300 group-active:w-44 sm:text-base group-hover:w-44">
        Login with <strong className="font-bold">{type}</strong>
      </p>
    </button>
  );
};
