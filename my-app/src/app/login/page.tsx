import { auth, signIn } from '@/auth';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { LineIcon } from '@/components/icons/LineIcon';
import { PageTitle } from "@/components/PageTitle";
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
    <div className="items-center mx-auto mt-20 flex w-full max-w-80 flex-1 flex-col justify-start gap-6 sm:max-w-96">
      <PageTitle>歡迎使用記帳追蹤</PageTitle>
      <div className="rounded-2xl border border-solid border-text shadow">
        <div className="flex w-full flex-col items-center gap-2 p-6 sm:gap-4">
          <h2 className="mb-4 w-full text-start text-lg font-bold sm:text-xl">
            Login with
          </h2>
          <SocialButton
            icon={<GoogleIcon className="size-5 text-background" />}
            type="Google"
            onClick={handleLoginGoogle}
            className="bg-red-500 hover:bg-red-700"
          />
          <SocialButton
            icon={<LineIcon className="size-5 text-background" />}
            type="Line"
            onClick={handleLoginLine}
            className="bg-green-500 hover:bg-green-700"
          />
        </div>
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
      className={`flex w-full items-center gap-10 rounded-md p-4 transition-colors sm:gap-16 ${className}`}
      {...legacy}
    >
      {icon}
      <p className="text-sm text-background sm:text-base">
        Login with <strong className="font-bold">{type}</strong>
      </p>
    </button>
  );
};
