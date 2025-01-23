import { ChartBlock } from '@/app/list/ChartBlock';
import { PrepareData } from '@/composites/PrepareData';

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col items-center p-4">
      <PrepareData />
      <ChartBlock />
    </div>
  );
}
