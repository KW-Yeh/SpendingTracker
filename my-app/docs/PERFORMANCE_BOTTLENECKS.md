# 效能瓶頸分析與解決方案

## 🔍 發現的瓶頸

### 1. 資料庫連線問題 ⚠️ **最嚴重**

**問題**: 每次 API 請求都建立新的資料庫連線

```typescript
// ❌ 原本的做法 (慢)
export async function getDb() {
  const password = await getPassword();  // ~50-100ms (AWS 簽名)
  const client = new Client({...});      // 建立新連線
  await client.connect();                // ~20-50ms (TCP handshake)
  return client;
}
```

**影響**:
- 每次請求額外 **70-150ms**
- AWS DSQL Signer 呼叫次數過多
- 資料庫連線數暴增

**解決方案**: Connection Pool + Token Caching

```typescript
// ✅ 優化後 (快)
export async function getPool(): Promise<Pool> {
  if (!pool) {
    const password = await getPassword();  // 只在第一次和 token 過期時呼叫
    pool = new Pool({
      max: 20,                    // 連線池大小
      idleTimeoutMillis: 30000,   // 閒置超時
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;  // 重複使用現有連線！
}
```

**效能提升**:
- 第一次請求: 70-150ms (需建立連線)
- 後續請求: **<5ms** (重複使用連線)
- 提升: **95%+**

---

### 2. Server Component 繞路問題 ⚠️ **中等嚴重**

**問題**: Server Component 透過 HTTP 呼叫自己的 API

```typescript
// ❌ 原本的做法 (慢)
export async function getDashboardDataServer(userId: number) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const response = await fetch(
    `${baseUrl}/api/aurora/dashboard?userId=${userId}`,  // HTTP round trip!
    ...
  );
}
```

**影響**:
- 額外 **10-30ms** HTTP 延遲
- 不必要的網路 I/O
- Server → Server 呼叫浪費資源

**解決方案**: 直接呼叫資料庫

```typescript
// ✅ 優化後 (快)
import { getDashboardDataDirect } from '@/services/optimizedServicesServer';

// Server Component 中
const data = await getDashboardDataDirect(userId);  // 直接查資料庫！
```

**效能提升**:
- 移除 HTTP overhead: **10-30ms**
- 總改善: ~**30-50%**

---

### 3. 快取被禁用 ⚠️ **輕微**

**問題**: `cache: 'no-store'` 禁用所有快取

```typescript
// ❌ 原本的做法
const response = await fetch('/api/...', {
  cache: 'no-store',  // 每次都重新 fetch
});
```

**影響**:
- Next.js 13+ 的 fetch cache 被完全禁用
- 即使資料沒變，每次都查資料庫

**解決方案**: 使用適當的快取策略

```typescript
// ✅ 快取 5 秒
const response = await fetch('/api/...', {
  next: { revalidate: 5 }
});

// ✅ 或使用 React Cache (Server Component)
import { cache } from 'react';

export const getCachedDashboard = cache(async (userId: number) => {
  return await getDashboardDataDirect(userId);
});
```

---

## 📊 效能對比

| 方法 | 第一次請求 | 後續請求 | 說明 |
|------|-----------|---------|------|
| **原本 (舊)** | ~300ms | ~300ms | 每次建立連線 + HTTP |
| **SQL Functions (舊)** | ~200ms | ~200ms | 減少查詢次數，但仍建立連線 |
| **Connection Pool (新)** | ~200ms | **~10ms** | 重複使用連線 |
| **Direct Call (新)** | ~150ms | **~5ms** | 跳過 HTTP + Pool |

**最大改善**: ~300ms → ~5ms = **98% 提升** 🚀

---

## 🚀 立即使用優化

### 方法 1: Client Component (使用 API)

```typescript
// 已經自動使用 Connection Pool！
import { getDashboardData } from '@/services/optimizedServices';

const data = await getDashboardData(userId);
```

**效能**: ~200ms → ~10ms

### 方法 2: Server Component (直接呼叫，最快)

```typescript
// ✅ 推薦！最快的方式
import { getDashboardDataDirect } from '@/services/optimizedServicesServer';

const data = await getDashboardDataDirect(userId);
```

**效能**: ~200ms → **~5ms**

### 方法 3: Server Component + Cache (更快)

```typescript
import { cache } from 'react';
import { getDashboardDataDirect } from '@/services/optimizedServicesServer';

// 在 request 生命週期內快取
const getCachedDashboard = cache(getDashboardDataDirect);

// 使用
const data = await getCachedDashboard(userId);
```

**效能**: ~5ms (第一次) → **<1ms** (重複呼叫)

---

## 🔧 檢查優化是否生效

### 1. 確認使用 Connection Pool

在 API route 中加入 log:

```typescript
console.time('[Dashboard API] Total');
const pool = await getPool();
console.log('[Dashboard API] Got pool');

const result = await pool.query('SELECT ...');
console.timeEnd('[Dashboard API] Total');
```

**預期輸出**:
```
[Dashboard API] Got pool      // <5ms (後續請求)
[Dashboard API] Total: 12ms   // 總時間
```

### 2. 確認 Token Cache 運作

檢查 console 是否不斷出現 AWS 簽名請求：

```typescript
// 在 getPassword() 中加入 log
async function getPassword() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    console.log('[getAurora] Using cached token');  // ✅ 應該看到這個
    return cachedToken.token;
  }
  console.log('[getAurora] Generating new token');  // ❌ 不應該頻繁出現
  ...
}
```

### 3. 測試效能

使用 curl 測試：

```bash
# 測試多次請求，應該會越來越快
time curl "http://localhost:3000/api/aurora/dashboard?userId=1"
time curl "http://localhost:3000/api/aurora/dashboard?userId=1"
time curl "http://localhost:3000/api/aurora/dashboard?userId=1"
```

**預期結果**:
- 第一次: ~200ms
- 第二次: **~10ms**
- 第三次: **~10ms**

---

## ⚠️ 注意事項

### Token 過期處理

Connection pool 會自動處理 token 過期：

```typescript
// 每 9 分鐘自動刷新 token (token 有效期 15 分鐘)
setInterval(async () => {
  const newPassword = await getPassword();
  await pool.end();
  pool = new Pool({ password: newPassword, ... });
}, 9 * 60 * 1000);
```

### Pool Size 調整

根據流量調整 pool size:

```typescript
pool = new Pool({
  max: 20,  // 小型應用: 10-20, 中型: 50, 大型: 100+
});
```

---

## 📈 監控建議

### 1. 加入效能指標

```typescript
// 在 API route 中
const startTime = Date.now();
const result = await pool.query(...);
const duration = Date.now() - startTime;

console.log(`[Dashboard API] Query took ${duration}ms`);

// 可以送到監控服務 (如 CloudWatch)
if (duration > 50) {
  console.warn('[Dashboard API] Slow query detected!', { duration, userId });
}
```

### 2. 監控 Pool 使用率

```typescript
const pool = await getPool();
console.log({
  total: pool.totalCount,      // 總連線數
  idle: pool.idleCount,        // 閒置連線數
  waiting: pool.waitingCount,  // 等待中的請求
});
```

---

**最後更新**: 2025-12-30
