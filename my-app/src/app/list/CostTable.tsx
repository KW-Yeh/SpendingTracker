import { normalizeNumber } from '@/utils/normalizeNumber';

export const CostTable = ({
  title,
  total,
  list,
  options = {
    headerStyle: 'bg-gray-200',
  },
}: {
  title: string;
  total: number;
  list: { name: string; value: number }[];
  options?: Partial<{
    headerStyle: string;
  }>;
}) => {
  return (
    <div className="flex w-full flex-col gap-2 whitespace-nowrap">
      <h3 className="font-semibold">{title}</h3>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className={options.headerStyle}>
            <th className="border border-solid border-gray-300 border-r-transparent px-2 py-1 text-center">
              類型
            </th>
            <th className="border border-solid border-gray-300 border-r-transparent px-2 py-1 text-right">
              比例 (%)
            </th>
            <th className="border border-solid border-gray-300 px-2 py-1 text-right">
              金額 (NTD)
            </th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr
              key={`income-${item.name}`}
              className={item.value === 0 ? 'text-gray-300' : ''}
            >
              <td className="col-span-1 border border-solid border-gray-300 p-2 text-center">
                {item.name}
              </td>
              <td className="col-span-1 border border-solid border-gray-300 p-2 text-end">
                {item.value === 0
                  ? 0
                  : (Math.round((item.value / total) * 100) || 0).toFixed(0)}
                %
              </td>
              <td className="col-span-2 border border-solid border-gray-300 p-2 text-end">
                ${normalizeNumber(item.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
