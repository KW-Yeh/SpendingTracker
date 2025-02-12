import { Accordion } from '@/components/Accordion';
import { MinusIcon } from '@/components/icons/MinusIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { ReactNode } from 'react';

interface Props {
  title: string;
  loading: boolean;
  categoryMap: Array<{ value: string; label: string }>;
  data: SpendingRecord[];
  children: (newData: SpendingRecord[]) => ReactNode;
}

export const CategoryAccordion = (props: Props) => {
  const { title, loading, categoryMap, data, children } = props;
  return (
    <>
      <div className="flex w-full items-center gap-2 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-300"></span>
        <span>{title}</span>
        <span className="h-px flex-1 bg-gray-300"></span>
      </div>
      {categoryMap.map(({ value, label }) => {
        const dataOfCategory = data.filter((item) => item.category === value);
        return (
          <Accordion
            key={`${title}-${value}`}
            defaultOpen={loading || dataOfCategory.length > 0}
            summary={(isOpen) =>
              isOpen ? (
                <span className="flex w-full items-center justify-between">
                  <span>
                    {value} {label}
                  </span>
                  <MinusIcon className="size-4" />
                </span>
              ) : (
                <span className="flex w-full items-center justify-between">
                  <span>
                    {value} {label}
                  </span>
                  <PlusIcon className="size-4" />
                </span>
              )
            }
            className="rounded-md border border-solid border-gray-300"
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
