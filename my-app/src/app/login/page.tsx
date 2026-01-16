import { auth, signIn } from '@/auth';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import LineLogoIcon from '@/assets/image/LINE_APP_Android.png';
import { redirect } from 'next/navigation';
import Image from 'next/image';
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
    <div className="flex w-full flex-1 items-center justify-center bg-radial p-4">
      <div className="flex w-full max-w-130 flex-col items-center justify-start gap-6 rounded-2xl bg-white/50 p-6 shadow-lg">
        <h1 className="text-2xl leading-18 font-black">Login</h1>
        <p className="text-gray-300">
          很抱歉，該系統暫時無法透過 Email 方式註冊並登入，請先用 Google 帳號或
          Line 帳號直接登入使用，感謝您的配合。
        </p>
        <span className="divider"></span>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row">
          <SocialButton
            icon={<GoogleIcon className="size-5" />}
            type="Google"
            onClick={handleLoginGoogle}
            className="w-full md:w-1/2"
          />
          <SocialButton
            icon={
              <Image src={LineLogoIcon} alt="line logo" className="size-5" />
            }
            type="Line"
            onClick={handleLoginLine}
            className="w-full md:w-1/2"
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
      className={`flex items-center justify-center gap-3 rounded-lg border border-solid border-gray-200 px-6 py-3 transition-colors hover:border-gray-500 ${className}`}
      {...legacy}
    >
      <span className="aspect-square">{icon}</span>
      <p className="text-center text-sm transition-all sm:text-base">
        Sign in with {type}
      </p>
    </button>
  );
};
