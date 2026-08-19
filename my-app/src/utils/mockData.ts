/**
 * Fixture data served by every context provider when a route carries
 * `?mock=1` (see `mockMode.ts`). Lets the whole UI be reviewed with realistic
 * numbers on a dev machine that cannot reach the database.
 *
 * Nothing here is ever written to localStorage — the providers skip their
 * cache writes in mock mode so real cached data is never overwritten.
 */
import { DEFAULT_DESC, Necessity, SpendingType } from '@/utils/constants';
import { CATEGORY_EMOJI_TO_DB_MAP } from '@/utils/categoryHelpers';

const MOCK_GROUP_ID = '999999';
const MOCK_EMAIL = 'analysis.mock@example.com';

const budgetItem = (category: string, description: string, amount: number) => ({
  category,
  description,
  months: Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => [String(index + 1), amount]),
  ),
});

export const MOCK_GROUP: Group = {
  account_id: Number(MOCK_GROUP_ID),
  name: 'Mock 家庭帳本',
  owner_id: 1,
  member_count: 3,
};

export const MOCK_USER: User = {
  user_id: 1,
  name: 'Mock 使用者',
  email: MOCK_EMAIL,
};

export const MOCK_BUDGET: Budget = {
  budget_id: 999999,
  account_id: Number(MOCK_GROUP_ID),
  annual_budget: 558000,
  monthly_budget: 46500,
  monthly_items: [
    budgetItem('🍔', '飲食預算', 12000),
    budgetItem('🏠', '居住預算', 16000),
    budgetItem('🚗', '交通預算', 5000),
    budgetItem('🎲', '娛樂預算', 4000),
    budgetItem('🧻', '日常預算', 3500),
    budgetItem('📚', '學習預算', 3000),
    budgetItem('💊', '醫療預算', 3000),
  ],
};

/** Common descriptions for the /edit chips, built from the shipped defaults. */
export const MOCK_FAVORITE_CATEGORIES: FavoriteCategories = {
  category_id: 999999,
  owner_id: MOCK_USER.user_id,
  ...Object.entries(DEFAULT_DESC).reduce<Record<string, string>>(
    (acc, [emoji, descriptions]) => {
      const column = CATEGORY_EMOJI_TO_DB_MAP[emoji];
      if (column && descriptions.length > 0)
        acc[column] = descriptions.join(',');
      return acc;
    },
    {},
  ),
};

const addRecord = (
  records: SpendingRecord[],
  date: Date,
  id: string,
  type: SpendingType,
  necessity: Necessity,
  amount: number,
  category: string,
  description: string,
) => {
  records.push({
    id,
    'user-token': MOCK_EMAIL,
    groupId: MOCK_GROUP_ID,
    type,
    date: date.toISOString(),
    necessity,
    amount: String(Math.round(amount)),
    category,
    description,
  });
};

const currentMonthKey = () => {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
};

/**
 * 13 months of records ending at `anchor`'s month, so the analysis page has a
 * full 12-month comparison window.
 *
 * Amounts are seeded from the ABSOLUTE month, not from the distance to the
 * anchor — otherwise the same calendar month would report different totals
 * depending on the range a page asked for, and the pages would disagree with
 * each other. Today's month carries a few extra same-day entries so date
 * grouping and daily subtotals have something to show.
 */
export const createMockRecords = (anchor: Date) => {
  const records: SpendingRecord[] = [];

  for (let offset = 0; offset < 13; offset += 1) {
    const date = new Date(
      anchor.getFullYear(),
      anchor.getMonth() + offset - 12,
      1,
      12,
    );
    const monthKey = date.getFullYear() * 12 + date.getMonth();
    const index = monthKey % 13;
    const isCurrentMonth = monthKey === currentMonthKey();
    const monthId = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const food = 9000 + index * 280 + (isCurrentMonth ? 3600 : 0);
    const housing = 15800;
    const transport = isCurrentMonth ? 3600 : 4300 + (index % 2) * 700;
    const entertainment =
      3000 + (index % 3) * 550 + (isCurrentMonth ? 1800 : 0);
    const daily = 2500 + index * 90;
    const learning = index % 4 === 0 ? 2600 : 900;
    const medical = index % 5 === 0 ? 1800 : 450;
    const salary = 62000 + (index >= 9 ? 2000 : 0);

    addRecord(
      records,
      new Date(date.getFullYear(), date.getMonth(), 5, 9),
      `${monthId}-salary`,
      SpendingType.Income,
      Necessity.Need,
      salary,
      '💰',
      '薪水',
    );
    addRecord(
      records,
      new Date(date.getFullYear(), date.getMonth(), 7, 20),
      `${monthId}-housing`,
      SpendingType.Outcome,
      Necessity.Need,
      housing,
      '🏠',
      '房租',
    );

    (
      [
        ['🍔', '午餐', food * 0.72, Necessity.Need],
        ['🍔', '聚餐', food * 0.28, Necessity.NotNeed],
        ['🚗', '加油', transport, Necessity.Need],
        ['🎲', '休閒娛樂', entertainment, Necessity.NotNeed],
        ['🧻', '生活用品', daily, Necessity.Need],
        ['📚', '課程書籍', learning, Necessity.NotNeed],
        ['💊', '醫療保健', medical, Necessity.Need],
      ] as [string, string, number, Necessity][]
    ).forEach(([category, description, amount, necessity], itemIndex) => {
      addRecord(
        records,
        new Date(
          date.getFullYear(),
          date.getMonth(),
          10 + itemIndex * 2,
          12 + itemIndex,
        ),
        `${monthId}-${itemIndex}`,
        SpendingType.Outcome,
        necessity,
        amount,
        category,
        description,
      );
    });

    if (isCurrentMonth) {
      (
        [
          [10, 8, '🍔', '早餐', 120, Necessity.Need],
          [10, 15, '🍔', '飲料', 95, Necessity.NotNeed],
          [14, 18, '🚗', '加值(悠遊)', 500, Necessity.Need],
        ] as [number, number, string, string, number, Necessity][]
      ).forEach(([day, hour, category, description, amount, necessity], i) => {
        addRecord(
          records,
          new Date(date.getFullYear(), date.getMonth(), day, hour),
          `${monthId}-extra-${i}`,
          SpendingType.Outcome,
          necessity,
          amount,
          category,
          description,
        );
      });
    }
  }

  return records;
};

/** Records inside an ISO date range — matches what `getItems` would return. */
export const mockRecordsInRange = (startDate?: string, endDate?: string) => {
  // Anchor on the END of the range: `createMockRecords` generates backwards
  // from its anchor, so anchoring on the start would leave the range empty.
  const anchor = endDate ? new Date(endDate) : new Date();
  const from = startDate ? new Date(startDate).getTime() : -Infinity;
  const to = endDate ? new Date(endDate).getTime() : Infinity;

  return createMockRecords(anchor).filter((record) => {
    const time = new Date(record.date).getTime();
    return time >= from && time <= to;
  });
};
