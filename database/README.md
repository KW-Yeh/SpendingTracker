# 資料庫遷移指南

> **目的**: 提供資料庫 schema 更新和效能優化的執行步驟

---

## 📋 目錄

1. [遷移檔案說明](#遷移檔案說明)
2. [執行步驟](#執行步驟)
3. [驗證方式](#驗證方式)
4. [回滾方案](#回滾方案)

---

## 📁 遷移檔案說明

### `migrations/001_performance_indexes.sql`

**用途**: 效能優化 - 階段 2 索引優化

**包含內容**:
- 6 個關鍵索引
- 索引使用說明
- 效能測試查詢
- 維護建議

**預估執行時間**:
- 小型資料庫 (< 10,000 筆): ~5 秒
- 中型資料庫 (10,000 - 100,000 筆): ~30 秒
- 大型資料庫 (> 100,000 筆): ~2 分鐘

**影響**:
- ✅ 只讀操作,不影響現有資料
- ✅ 不鎖表,可線上執行
- ✅ 向後相容,不影響現有功能

---

## 🚀 執行步驟

### 方法 1: 使用 psql (推薦)

```bash
# 1. 連接到資料庫
psql -h your-database-host \
     -U your-username \
     -d your-database-name

# 2. 執行遷移腳本
\i database/migrations/001_performance_indexes.sql

# 3. 驗證索引建立
\di idx_*

# 4. 離開
\q
```

### 方法 2: 使用資料庫管理工具

#### pgAdmin
1. 開啟 pgAdmin
2. 連接到目標資料庫
3. Tools → Query Tool
4. 開啟 `001_performance_indexes.sql`
5. 點擊 Execute (F5)

#### DBeaver
1. 開啟 DBeaver
2. 連接到目標資料庫
3. SQL Editor → Open SQL Script
4. 選擇 `001_performance_indexes.sql`
5. 點擊 Execute SQL Script (Ctrl+Enter)

#### Supabase Dashboard
1. 登入 Supabase Dashboard
2. 選擇 Project → SQL Editor
3. 建立新查詢
4. 貼上 `001_performance_indexes.sql` 內容
5. 點擊 Run

### 方法 3: 使用 Node.js 腳本

```bash
# 在 my-app 目錄下執行
cd my-app
npm run db:migrate
```

**注意**: 需要先建立 `scripts/migrate.js` (見下方)

---

## ✅ 驗證方式

### 1. 檢查索引是否建立成功

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE indexname IN (
  'idx_account_members_user_account',
  'idx_transactions_account_date_type',
  'idx_transactions_outcome_only',
  'idx_budgets_account',
  'idx_transactions_year_month',
  'idx_users_email'
)
ORDER BY tablename, indexname;
```

**預期結果**: 應該看到 6 個索引

### 2. 測試查詢效能

```sql
-- 測試帳本查詢 (應該使用索引)
EXPLAIN ANALYZE
SELECT gm.account_id, g.name
FROM account_members gm
JOIN accounts g ON gm.account_id = g.account_id
WHERE gm.user_id = 1;
```

**預期結果**:
- 查詢計畫中應該出現 "Index Scan using idx_account_members_user_account"
- 執行時間應該顯著減少

### 3. 監控索引使用情況

```sql
-- 查詢索引使用統計
SELECT
  schemaname,
  tablename,
  indexrelname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read
FROM pg_stat_user_indexes
WHERE indexrelname LIKE 'idx_%'
ORDER BY idx_scan DESC;
```

**預期結果**:
- 使用一段時間後,`idx_scan` 應該 > 0
- 表示索引有被使用

---

## 🔄 回滾方案

如果需要移除這些索引:

```sql
-- 移除所有效能優化索引
DROP INDEX IF EXISTS idx_account_members_user_account;
DROP INDEX IF EXISTS idx_transactions_account_date_type;
DROP INDEX IF EXISTS idx_transactions_outcome_only;
DROP INDEX IF EXISTS idx_budgets_account;
DROP INDEX IF EXISTS idx_transactions_year_month;
DROP INDEX IF EXISTS idx_users_email;
```

**注意**:
- 移除索引不會影響資料
- 但查詢效能會恢復到優化前
- 建議在非高峰時段執行

---

## 📊 效能預期

### 優化前
- 帳本查詢: ~50ms
- 日期範圍查詢: ~200ms
- 月度統計: ~300ms

### 優化後
- 帳本查詢: ~5ms ⬇️ 90%
- 日期範圍查詢: ~20ms ⬇️ 90%
- 月度統計: ~30ms ⬇️ 90%

**實際效果會根據資料量和硬體配置有所不同**

---

## 🛠️ 自動化遷移腳本 (選用)

如果想要自動化執行遷移,可以建立以下腳本:

### `my-app/scripts/migrate.js`

```javascript
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting database migration...');

    const sqlPath = path.join(__dirname, '../../database/migrations/001_performance_indexes.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await client.query(sql);

    console.log('✅ Migration completed successfully!');

    // 驗證索引
    const result = await client.query(`
      SELECT count(*) as count
      FROM pg_indexes
      WHERE indexname LIKE 'idx_%'
    `);

    console.log(`📊 Total indexes created: ${result.rows[0].count}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
```

### `my-app/package.json` 新增腳本

```json
{
  "scripts": {
    "db:migrate": "node scripts/migrate.js"
  }
}
```

---

## ⚠️ 注意事項

1. **備份資料庫**: 執行前建議備份 (雖然只是建立索引)
2. **執行時機**: 建議在非高峰時段執行
3. **監控效能**: 執行後監控資料庫 CPU 和記憶體使用
4. **索引維護**: PostgreSQL 會自動維護索引,無需手動操作

---

## 📞 問題排查

### 問題 1: 索引建立失敗

**錯誤**: `ERROR: could not create unique index`

**原因**: 可能有重複資料

**解決**: 檢查資料完整性,移除重複資料

### 問題 2: 執行時間過長

**現象**: 索引建立超過 5 分鐘

**原因**: 資料量大或資源不足

**解決**:
- 檢查資料庫資源使用情況
- 考慮在維護視窗執行
- 使用 `CREATE INDEX CONCURRENTLY` (不鎖表但較慢)

### 問題 3: 索引未被使用

**現象**: `idx_scan` 一直是 0

**原因**: 查詢條件不匹配或統計資訊過舊

**解決**:
```sql
-- 更新表統計資訊
ANALYZE transactions;
ANALYZE account_members;
ANALYZE budgets;
```

---

## 📦 階段 3: SQL Functions (選用)

### 遷移檔案: `migrations/002_sql_functions.sql`

**用途**: 透過 SQL Functions 減少 API 往返次數

**包含 Functions**:

1. **`get_user_dashboard_data(user_id)`**: 一次查詢取得所有儀表板資料
   - 取代 3-4 次 API 呼叫 (user → groups → transactions)
   - 效能提升: ~70-90%

2. **`get_budget_page_data(account_id, year)`**: 一次查詢取得所有預算頁面資料
   - 取代 2-3 次 API 呼叫 (budget → transactions → monthly stats)
   - 效能提升: ~70-90%

3. **`get_account_transactions(account_id, start_date, end_date)`**: 優化的交易查詢
   - 使用索引優化的日期範圍查詢
   - 返回 JSON 格式

4. **`get_user_groups_with_permissions(user_id)`**: 取得使用者的所有帳本及權限
   - 包含擁有者資訊和成員數量
   - 一次查詢完成所有 JOIN

### 執行步驟

```bash
# 使用 psql
psql -h your-database-host \
     -U your-username \
     -d your-database-name \
     -f database/migrations/002_sql_functions.sql

# 或使用 AWS RDS Query Editor
# 複製 002_sql_functions.sql 內容並執行
```

### 驗證 Functions

```sql
-- 列出所有建立的 Functions
SELECT
  proname as function_name,
  pg_get_function_arguments(oid) as arguments
FROM pg_proc
WHERE proname IN (
  'get_user_dashboard_data',
  'get_budget_page_data',
  'get_account_transactions',
  'get_user_groups_with_permissions'
);

-- 測試 Function (替換實際的 ID)
SELECT get_user_dashboard_data(1);
SELECT get_budget_page_data(1, 2025);
```

### 新的 API Endpoints

執行 SQL Functions 後,您可以使用以下優化的 API:

**1. Dashboard API**
```typescript
// Client-side
import { getDashboardData } from '@/services/optimizedServices';
const data = await getDashboardData(userId);

// Server-side
import { getDashboardDataServer } from '@/services/optimizedServices';
const data = await getDashboardDataServer(userId);
```

**2. Budget Page API**
```typescript
// Client-side
import { getBudgetPageData } from '@/services/optimizedServices';
const data = await getBudgetPageData(accountId, 2025);

// Server-side
import { getBudgetPageDataServer } from '@/services/optimizedServices';
const data = await getBudgetPageDataServer(accountId, 2025);
```

### 預期效能提升

| 操作 | 原始方式 | 優化後 | 改善幅度 |
|------|---------|--------|---------|
| Dashboard 載入 | ~150ms (3-4 queries) | ~30ms (1 query) | 80% ↓ |
| Budget Page 載入 | ~250ms (2-3 queries) | ~50ms (1 query) | 80% ↓ |
| API 往返次數 | 4-5 次 | 1-2 次 | 70% ↓ |

### 回滾方案

```sql
-- 移除所有 Functions
DROP FUNCTION IF EXISTS get_user_dashboard_data(INT);
DROP FUNCTION IF EXISTS get_budget_page_data(INT, INT);
DROP FUNCTION IF EXISTS get_account_transactions(INT, DATE, DATE);
DROP FUNCTION IF EXISTS get_user_groups_with_permissions(INT);
```

---

**最後更新**: 2025-12-26
**維護者**: Development Team
