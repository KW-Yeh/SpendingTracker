import { normalizeNumber } from '@/utils/normalizeNumber';

export const CostTable = ({
  title,
  total,
  list,
}: {
  title: string;
  total: number;
  list: PieChartDataItem[];
}) => {
  const largest = list.reduce(
    (prev, current) => {
      return prev.value > current.value ? prev : current;
    },
    {
      id: '',
      name: '',
      value: 0,
      necessary: 0,
      unnecessary: 0,
      color: '',
    },
  );
  return (
    <div className="my-2 flex w-full flex-col gap-2 rounded-xl p-3 shadow">
      <h3 className="text-sm font-semibold">{title}</h3>
      <table className="w-full border-collapse border border-solid border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-solid border-gray-300 px-2 py-px text-left">
              類型
            </th>
            <th className="border border-solid border-gray-300 px-2 py-px text-right">
              比例 (%)
            </th>
            <th className="border border-solid border-gray-300 px-2 py-px text-right">
              金額 (NTD)
            </th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr
              key={`income-${item.name}`}
              className={largest.name === item.name ? 'bg-orange-100' : ''}
            >
              <td className="col-span-1 border border-solid border-gray-300 px-2 py-px">
                {item.name}
              </td>
              <td className="col-span-1 border border-solid border-gray-300 px-2 py-px text-end">
                {((item.value / total) * 100).toFixed(2)}%
              </td>
              <td className="col-span-2 border border-solid border-gray-300 px-2 py-px text-end">
                ${normalizeNumber(item.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
