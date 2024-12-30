import { Session } from 'next-auth';
import Image from 'next/image';

export const Account = ({ session }: { session: Session | null }) => {
  return (
    <div className="mb-4 flex w-full items-center gap-4">
      <div className="size-14 rounded-full bg-gray-500 p-px">
        {session?.user && (
          <Image
            src={session.user.image ?? ''}
            alt={session.user.email ?? ''}
            width={56}
            height={56}
            className="size-full rounded-full"
          />
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-bold sm:text-lg">
          {session?.user ? session.user.name : '尚未登入'}
        </h3>
        <h3 className="text-xs sm:text-sm">
          {session?.user ? session.user.email : '尚未登入'}
        </h3>
      </div>
    </div>
  );
};
