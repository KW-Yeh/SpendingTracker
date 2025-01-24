import { Select } from '@/components/Select';

interface Props {
  refreshData: (groupId: string) => void;
  groupOptions: {
    setGroupId: (groupId: string) => void;
    loadingGroups: boolean;
    group?: Group;
    groups: Group[];
  };
  dateOptions: {
    today: Date;
    year: string;
    setYear: (year: string) => void;
    month: string;
    setMonth: (month: string) => void;
  };
}

export const Filter = (props: Props) => {
  const { refreshData, groupOptions, dateOptions } = props;
  const { setGroupId, loadingGroups, groups, group } = groupOptions;
  const { today, setYear, year, setMonth, month } = dateOptions;

  return (
    <div className="flex items-center gap-4">
      <Select
        name="group"
        value={group?.name ?? '個人'}
        onChange={(_id) => {
          setGroupId(_id);
          refreshData(_id);
        }}
        className="w-36 rounded-full border border-solid border-gray-300 px-4 py-1 transition-colors active:border-text sm:hover:border-text"
        menuStyle="max-w-60"
      >
        <Select.Item value="">個人</Select.Item>
        {!loadingGroups &&
          groups.map((group) => (
            <Select.Item key={group.id} value={group.id}>
              {group.name}
            </Select.Item>
          ))}
      </Select>
      <div className="flex items-center justify-center gap-2 rounded-full border border-solid border-gray-300 px-4 py-1">
        <Select name="year" value={year} onChange={setYear}>
          {Array(11)
            .fill(0)
            .map((_, i) => (
              <Select.Item
                key={`${today.getFullYear() - 5 + i}`}
                value={`${today.getFullYear() - 5 + i}`}
              >
                {`${today.getFullYear() - 5 + i}`}
              </Select.Item>
            ))}
        </Select>
        <span>年</span>
        <Select name="month" value={month} onChange={setMonth} className="w-8">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Select.Item key={(i + 1).toString()} value={(i + 1).toString()}>
                {i + 1}
              </Select.Item>
            ))}
        </Select>
        <span>月</span>
      </div>
    </div>
  );
};
