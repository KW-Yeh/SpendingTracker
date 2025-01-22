import { UserLayer } from '@/app/setting/UserLayer';

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col items-center p-4">
      <UserLayer />
    </div>
  );
}
