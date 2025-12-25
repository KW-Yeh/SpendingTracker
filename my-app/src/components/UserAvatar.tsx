export function UserAvatar({ user }: { user?: User | null }) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="bg-primary-100 flex size-full items-center justify-center rounded-full">
      <span className="text-primary-500 text-2xl font-bold">
        {initial}
      </span>
    </div>
  );
}
