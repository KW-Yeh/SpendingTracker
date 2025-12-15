// 測試用假資料，用於開發階段確認 UI 樣式
// 實際使用時會從 API 獲取真實資料

export const MOCK_GROUPS: Group[] = [
  {
    id: 'test-group-1',
    name: '家庭記帳本',
    users: [
      {
        name: 'KaiWei Yeh',
        email: 'a0979597291@gmail.com',
        image:
          'https://lh3.googleusercontent.com/a/ACg8ocKqGZJ8Zv5Z4xQKw8qGZJ8Zv5Z4xQKw8qGZJ8Zv5Z4xQ=s96-c',
      },
      {
        name: 'Alice Chen',
        email: 'alice.chen@example.com',
        image: 'https://i.pravatar.cc/150?img=1',
      },
      {
        name: 'Bob Wang',
        email: 'bob.wang@example.com',
        image: 'https://i.pravatar.cc/150?img=2',
      },
    ],
  },
  {
    id: 'test-group-2',
    name: '旅遊基金',
    users: [
      {
        name: 'KaiWei Yeh',
        email: 'a0979597291@gmail.com',
        image:
          'https://lh3.googleusercontent.com/a/ACg8ocKqGZJ8Zv5Z4xQKw8qGZJ8Zv5Z4xQKw8qGZJ8Zv5Z4xQ=s96-c',
      },
      {
        name: 'Charlie Lin',
        email: 'charlie.lin@example.com',
        image: 'https://i.pravatar.cc/150?img=3',
      },
      {
        name: 'Diana Wu',
        email: 'diana.wu@example.com',
        image: 'https://i.pravatar.cc/150?img=4',
      },
      {
        name: 'Eric Huang',
        email: 'eric.huang@example.com',
        image: 'https://i.pravatar.cc/150?img=5',
      },
    ],
  },
  {
    id: 'test-group-3',
    name: '室友共同開銷',
    users: [
      {
        name: 'KaiWei Yeh',
        email: 'a0979597291@gmail.com',
        image:
          'https://lh3.googleusercontent.com/a/ACg8ocKqGZJ8Zv5Z4xQKw8qGZJ8Zv5Z4xQKw8qGZJ8Zv5Z4xQ=s96-c',
      },
      {
        name: 'Frank Liu',
        email: 'frank.liu@example.com',
        image: 'https://i.pravatar.cc/150?img=6',
      },
    ],
  },
];

export const MOCK_SPENDING_RECORDS: SpendingRecord[] = [
  {
    id: 'record-1',
    'user-token': 'a0979597291@gmail.com',
    groupId: 'test-group-1',
    type: 'Outcome',
    date: new Date().toISOString(),
    necessity: '必',
    amount: '350',
    category: '🍔',
    description: '午餐便當',
  },
  {
    id: 'record-2',
    'user-token': 'alice.chen@example.com',
    groupId: 'test-group-1',
    type: 'Outcome',
    date: new Date().toISOString(),
    necessity: '非',
    amount: '150',
    category: '☕',
    description: '下午茶咖啡',
  },
  {
    id: 'record-3',
    'user-token': 'bob.wang@example.com',
    groupId: 'test-group-1',
    type: 'Outcome',
    date: new Date(Date.now() - 86400000).toISOString(), // 昨天
    necessity: '必',
    amount: '1200',
    category: '🏠',
    description: '水電費',
  },
  {
    id: 'record-4',
    'user-token': 'a0979597291@gmail.com',
    groupId: 'test-group-1',
    type: 'Outcome',
    date: new Date(Date.now() - 86400000).toISOString(),
    necessity: '必',
    amount: '500',
    category: '🚗',
    description: '加油',
  },
  {
    id: 'record-5',
    'user-token': 'alice.chen@example.com',
    groupId: 'test-group-1',
    type: 'Income',
    date: new Date(Date.now() - 172800000).toISOString(), // 前天
    necessity: '必',
    amount: '5000',
    category: '💰',
    description: '分擔費用',
  },
  {
    id: 'record-6',
    'user-token': 'charlie.lin@example.com',
    groupId: 'test-group-2',
    type: 'Outcome',
    date: new Date().toISOString(),
    necessity: '非',
    amount: '2500',
    category: '✈️',
    description: '機票訂金',
  },
  {
    id: 'record-7',
    'user-token': 'diana.wu@example.com',
    groupId: 'test-group-2',
    type: 'Outcome',
    date: new Date().toISOString(),
    necessity: '非',
    amount: '3500',
    category: '🏨',
    description: '住宿預訂',
  },
  {
    id: 'record-8',
    'user-token': 'frank.liu@example.com',
    groupId: 'test-group-3',
    type: 'Outcome',
    date: new Date().toISOString(),
    necessity: '必',
    amount: '800',
    category: '🛒',
    description: '購買生活用品',
  },
];

// 用於測試的標記，實際部署時應該是 false
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development';
