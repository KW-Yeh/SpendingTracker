import { Accordion } from '@/components/Accordion';
import { MinusIcon } from '@/components/icons/MinusIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { ReactNode } from 'react';

interface Props {
  title: string;
  categoryMap: Array<{ value: string; label: string }>;
  data: SpendingRecord[];
  children: (newData: SpendingRecord[]) => ReactNode;
}

export const CategoryAccordion = (props: Props) => {
  const { title, categoryMap, data, children } = props;
  return (
    <>
      <div className="flex w-full items-center gap-2 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200"></span>
        <span>{title}</span>
        <span className="h-px flex-1 bg-gray-200"></span>
      </div>
      {categoryMap.map(({ value, label }) => {
        const dataOfCategory = data.filter((item) => item.category === value);
        return (
          <Accordion
            key={`${title}-${value}`}
            defaultOpen={true}
            summary={(isOpen) => (
              <p className="flex w-full items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="ml-1 text-base font-bold">{label}</span>
                  <span className="text-text-gray text-xs">
                    ({dataOfCategory.length})
                  </span>
                </span>
                {isOpen ? (
                  <MinusIcon className="size-4" />
                ) : (
                  <PlusIcon className="size-4" />
                )}
              </p>
            )}
            className="rounded-lg border border-solid border-gray-300"
            buttonProps={{
              className: 'px-2 py-3 w-full',
            }}
          >
            {children(dataOfCategory)}
          </Accordion>
        );
      })}
    </>
  );
};
