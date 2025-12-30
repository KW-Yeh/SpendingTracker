# 開發指南

## ⚠️ Commit 前必讀

### 黃金規則：先 Build 再 Commit

**永遠在 commit 和 push 之前執行 build 檢查！**

## 🔍 Pre-commit 檢查流程

### 方法 1: 使用自動化腳本（推薦）

```bash
# 在專案根目錄執行
./scripts/pre-push-check.sh
```

這會自動執行：
1. ✅ Type check
2. ✅ Build
3. ✅ Lint

### 方法 2: 手動執行

```bash
cd my-app

# 1. Type check
npm run type-check

# 2. Build
npm run build

# 3. Lint (optional)
npm run lint
```

### 方法 3: 一鍵執行

```bash
cd my-app
npm run pre-commit
```

## 📋 完整 Commit 流程

```bash
# 1. 修改程式碼
# ... coding ...

# 2. 檢查變更
git status
git diff

# 3. 執行 pre-commit 檢查
./scripts/pre-push-check.sh

# 4. 如果檢查通過，才 commit
git add .
git commit -m "feat: your commit message"

# 5. Push
git push origin main
```

## ❌ 常見錯誤

### Type Check 失敗

```bash
❌ Type check failed. Please fix TypeScript errors before committing.
```

**解決方式**:
1. 檢查錯誤訊息
2. 修正 TypeScript 錯誤
3. 重新執行 `npm run type-check`

### Build 失敗

```bash
❌ Build failed. Please fix build errors before committing.
```

**解決方式**:
1. 檢查 build 錯誤訊息
2. 修正問題（通常是 import 錯誤、語法錯誤等）
3. 重新執行 `npm run build`

## 🚫 永遠不要

- ❌ 跳過 build 檢查直接 commit
- ❌ Build 失敗還強制 push
- ❌ 忽略 TypeScript 錯誤

## ✅ 最佳實踐

1. **小步提交**: 每次 commit 只包含一個邏輯變更
2. **清晰的 commit message**: 使用 conventional commits 格式
   - `feat:` - 新功能
   - `fix:` - Bug 修復
   - `perf:` - 效能優化
   - `refactor:` - 重構
   - `docs:` - 文件更新
3. **測試後再 commit**: 確保功能正常運作
4. **定期 pull**: 開始工作前先 `git pull`

## 🛠️ 開發工作流程

```bash
# 1. 同步最新程式碼
git pull origin main

# 2. 開發功能
npm run dev

# 3. 測試功能
# ... 手動測試 ...

# 4. Pre-commit 檢查
./scripts/pre-push-check.sh

# 5. Commit
git add .
git commit -m "feat: add new feature"

# 6. Push
git push origin main
```

## 📚 相關文件

- [OPTIMIZED_APIS.md](my-app/docs/OPTIMIZED_APIS.md) - API 使用說明
- [PERFORMANCE_BOTTLENECKS.md](my-app/docs/PERFORMANCE_BOTTLENECKS.md) - 效能優化指南
- [database/README.md](database/README.md) - 資料庫遷移指南

## 🆘 遇到問題？

1. 檢查 console 錯誤訊息
2. 執行 `npm install` 確保依賴安裝完整
3. 刪除 `.next` 資料夾後重新 build
4. 檢查環境變數是否正確設定

---

**記住：良好的開發習慣從每一次 commit 開始！**
