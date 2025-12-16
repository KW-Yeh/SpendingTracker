import Image from 'next/image';
export function UserAvatar({ user }: { user?: User | null }) {
  return user && user.image ? (
    <Image
      src={user.image ?? ''}
      alt={user.email ?? ''}
      width={48}
      height={48}
      className="rounded-full"
    />
  ) : (
    <div className="bg-primary-100 flex size-full items-center justify-center rounded-full">
      <span className="text-primary-500 text-2xl font-bold">
        {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </span>
    </div>
  );
}
