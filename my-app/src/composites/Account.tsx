import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';

export const Account = ({ session }: { session: Session | null }) => {
  if (!session?.user) {
    return (
      <div className="mb-6 flex flex-col items-center">
        <Link
          href="/login"
          className="group relative mb-4 flex size-16 items-center justify-center rounded-full bg-gray-500 p-1 transition-colors hover:bg-gray-700 sm:size-20"
        >
          <span className="rounded-full text-center text-white opacity-0 transition-opacity group-hover:opacity-100">
            登入
          </span>
        </Link>
        <h3 className="text-base font-bold sm:text-lg">尚未登入</h3>
      </div>
    );
  }
  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="mb-4 size-16 rounded-full bg-gray-500 p-1 sm:size-20">
        <Image
          src={session.user.image ?? ''}
          alt={session.user.email ?? ''}
          width={60}
          height={60}
          className="size-full rounded-full"
        />
      </div>
      <h3 className="text-base font-bold sm:text-lg">
        {session.user.name ?? '無名氏'}
      </h3>
    </div>
  );
};
