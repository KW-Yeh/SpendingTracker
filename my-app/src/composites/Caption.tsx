import { RouteTitle } from '@/components/RouteTitle';
import { GroupSelector } from '@/composites/GroupSelector';
import { MenuButton } from '@/composites/MenuButton';

export const Caption = ({ openAside }: { openAside: () => void }) => {
  return (
    <div className="sticky top-0 left-0 z-40 w-full p-4 shadow backdrop-blur">
      <div className="relative flex items-center">
        <MenuButton openAside={openAside} />
        <div className="flex flex-1 justify-center gap-4 pr-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
          >
            <linearGradient id="bg">
              <stop
                style={{
                  stopColor: '#5c33cc',
                }}
                offset="0%"
              />
              <stop
                style={{
                  stopColor: '#fda5d5',
                }}
                offset="100%"
              />
            </linearGradient>
            <path
              fill="url(#bg)"
              d="M 0,8 A 8,8 0,0,1 8,0 L 24,0 A 8,8 0,0,1 32,8 L 32,24 A 8,8 0,0,1 24,32 L 8,32 A 8,8 0,0,1 0, 24 L 0,8 z"
            />
            <path
              fill="white"
              d="M 12,8 L 16,8 A 24 8 0 0 0 12,16 A 30 8 0 0 1 10,24 A 8,8 0,0,1 4,24 A 24 8 0 0 0 10,16 A 30 8 0 0 1 12,8 z"
            />
            <path
              fill="white"
              d="M 12,8 L 28,8 A 24 4 0 0 1 28,10 L 22.5,10 L 22.5,24 A 4 24 0 0 1 20,24 L 20,10 L 12,10 A 10 2 0 0 1 12,8 z"
            />
          </svg>
          <RouteTitle />
        </div>
        <div className="absolute right-0 w-fit">
          <GroupSelector />
        </div>
      </div>
    </div>
  );
};
