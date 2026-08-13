import { Necessity, SpendingType } from '@/utils/constants';

const MOCK_GROUP_ID = '999999';
const MOCK_EMAIL = 'analysis.mock@example.com';

const budgetItem = (category: string, description: string, amount: number) => ({
  category,
  description,
  months: Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => [String(index + 1), amount]),
  ),
});

export const MOCK_ANALYSIS_GROUP: Group = {
  account_id: Number(MOCK_GROUP_ID),
  name: 'Mock 家庭帳本',
  owner_id: 1,
};

export const MOCK_ANALYSIS_BUDGET: Budget = {
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

export const createMockAnalysisRecords = (anchor: Date) => {
  const records: SpendingRecord[] = [];

  for (let index = 0; index < 13; index += 1) {
    const date = new Date(
      anchor.getFullYear(),
      anchor.getMonth() + index - 12,
      1,
      12,
    );
    const monthId = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const food = 9000 + index * 280 + (index === 12 ? 3600 : 0);
    const housing = 15800;
    const transport = index === 12 ? 3600 : 4300 + (index % 2) * 700;
    const entertainment = 3000 + (index % 3) * 550 + (index === 12 ? 1800 : 0);
    const daily = 2500 + index * 90;
    const learning = index % 4 === 0 ? 2600 : 900;
    const medical = index % 5 === 0 ? 1800 : 450;
    const salary = 62000 + (index >= 9 ? 2000 : 0);

    addRecord(
      records,
      new Date(date.getFullYear(), date.getMonth(), 5, 12),
      `${monthId}-salary`,
      SpendingType.Income,
      Necessity.Need,
      salary,
      '💰',
      '薪資',
    );
    addRecord(
      records,
      new Date(date.getFullYear(), date.getMonth(), 7, 12),
      `${monthId}-housing`,
      SpendingType.Outcome,
      Necessity.Need,
      housing,
      '🏠',
      '房租與管理費',
    );

    [
      ['🍔', '日常餐飲', food * 0.72, Necessity.Need],
      ['🍔', '聚餐', food * 0.28, Necessity.NotNeed],
      ['🚗', '交通', transport, Necessity.Need],
      ['🎲', '休閒娛樂', entertainment, Necessity.NotNeed],
      ['🧻', '生活用品', daily, Necessity.Need],
      ['📚', '課程書籍', learning, Necessity.NotNeed],
      ['💊', '醫療保健', medical, Necessity.Need],
    ].forEach(([category, description, amount, necessity], itemIndex) => {
      addRecord(
        records,
        new Date(date.getFullYear(), date.getMonth(), 10 + itemIndex * 2, 12),
        `${monthId}-${itemIndex}`,
        SpendingType.Outcome,
        necessity as Necessity,
        amount as number,
        category as string,
        description as string,
      );
    });
  }

  return records;
};
