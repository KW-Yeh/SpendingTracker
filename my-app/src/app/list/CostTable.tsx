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
  const sortedList = list.sort((a, b) => b.value - a.value);
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
          {sortedList.map((item) => (
            <tr key={`income-${item.name}`}>
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
