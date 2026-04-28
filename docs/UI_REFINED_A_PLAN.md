# SpendingTracker UI/UX 優化 — A 方案修改計劃

> 給 Claude Code 在本機執行的修改清單。基於 `Direction A · Refined Calm`：保留 Solo Leveling 深色基底，但壓低 glow、修正色彩語意、強化字級層級、收緊密度。

---

## 0. 執行原則（請 Claude Code 先讀完再動手）

1. **小步提交**：每個 Phase 完成後跑 `npm run lint`、視覺自查，再進下一個 Phase。
2. **不破壞 token 系統**：所有顏色變動必須同步 `src/styles/colors.ts` 與 `src/app/globals.css` 的 CSS 變數。
3. **避免硬編碼**：不要在 component 裡寫死 hex；用 `colors.ts` 的常數或 CSS 變數。
4. **保留現有行為**：只動視覺與排版，不動 data flow / context / API。
5. **每個 Phase 結束後**：`git add . && git commit -m "ui(refined-A): <phase 名稱>"`。

---

## Phase 1 — Token 修正（色彩語意）

### 動機
原系統把「支出」用紫色（`OUTCOME_PRIMARY: #A855F7`），違反金融慣例（紅 = 支出 / 綠 = 收入）。紫色保留作 *secondary accent*，但支出色改為珊瑚紅 `#F87171`，並補一組 over-budget 用的鮮紅與 warning 琥珀。

### 修改檔案

**`src/styles/colors.ts`**
- 在 `SEMANTIC_COLORS` 之上新增一組 `MONEY_COLORS`：
  ```ts
  export const MONEY_COLORS = {
    income:        '#34D399', // emerald-400
    incomeMuted:   'rgba(52,211,153,.10)',
    expense:       '#F87171', // coral-400 — 取代紫色
    expenseMuted:  'rgba(248,113,113,.10)',
    overBudget:    '#FB7185', // rose-400 — 比 expense 更鮮，專給超支用
    warning:       '#FBBF24', // amber-400 — 80–99% 預算
    primary:       PRIMARY_COLORS[500],
    primaryGlow:   '6, 182, 212', // rgb 給 rgba() 用
  } as const;
  ```
- 把 `CHART_COLORS.OUTCOME_PRIMARY` 從 `#A855F7` 改為 `#F87171`，相關 `OUTCOME_NECESSARY` `#C084FC → #FCA5A5`、`OUTCOME_UNNECESSARY` `#D8B4FE → #FECACA`。紫色保留在 `CHART_COLOR_PALETTE` 第二位給多系列圖。

**`src/app/globals.css`**
- 找出 `--color-secondary-*` / 任何 `outcome` 相關 CSS 變數，把支出語意色從紫改為珊瑚紅。
- 新增變數：
  ```css
  --color-expense: #F87171;
  --color-expense-bg: rgba(248,113,113,.10);
  --color-over-budget: #FB7185;
  --color-warning: #FBBF24;
  ```

### 全域 search & replace（Claude Code 自動執行）
- `grep -r "#A855F7" src/` → 凡是用在「支出金額」「支出進度條」「Outcome 文字」的，全改 `var(--color-expense)` 或 `MONEY_COLORS.expense`
- 圖表顏色（`OUTCOME_PRIMARY`）也一併替換

---

## Phase 2 — 首頁 Dashboard 重組

> 對應檔：`src/app/DashboardSection.tsx`、`src/app/transactions/Overview.tsx`、`src/app/transactions/SpendingInfoSection.tsx`、`src/app/transactions/MiniDailyCostChart.tsx`

### 2.1 Hero 區（`Overview.tsx`）
- 把目前並排的「結餘 + 進度條 + 3 個小卡 + 可展開預算 + CTA」**拆成兩層**：
  1. **Hero 主數字**：只放「本月結餘」一個大數字（42px、`font-weight:800`）+ 單位 + 短狀態文字（`剩 X%` 或紅字 `超支`）
  2. **進度條 slim 化**：高度由 `8px` 降到 `6px`，加一個圓點 marker 在當前位置
- 移除 hero 卡的多重 border + glow 疊加，保留一層 1px subtle border + 卡片背景。

### 2.2 收支雙卡（新拆出 `Overview.tsx` 內小元件）
- 拿掉 3 個小卡，改成 **2 個 tile**：本月收入 / 本月支出，下方加 `+5.2% vs 上月` 的 delta（用該類別的色：收入綠、支出珊瑚）。
- Tile padding `12-14px`、icon 14px、label 11px、數字 20px、delta 11px。

### 2.3 Spending Pulse（`MiniDailyCostChart.tsx`）
- 改寫為單系列強對比 bar，用 `MONEY_COLORS.primary` 漸層：
  - 高峰日 highlight（高度最高的 bar 用實心主色，其餘用 `rgba(...,.6)`）
  - 圖表上方加 secondary text：`平均 $X / 天`
- 區塊標題用 Eyebrow style（11px、letter-spacing .12em、`color: text-muted`）

### 2.4 預算超支警告（新增）
- 若有 `category.spent > category.budget`，在收支卡下方新增一條 alert row（`bg: rgba(248,113,113,.08)` + `border: rgba(248,113,113,.25)`），點擊跳轉 `/budget`。
- 一般狀況不顯示。

### 2.5 近期交易（`SpendingList.tsx` / `SpendingItem.tsx`）
- 列表 item card 高度收緊到 ~58px，padding `10-12px`，圓角 `14px`
- 必要支出 emoji 加 `box-shadow: inset 0 0 0 1px rgba(6,182,212,.3)`，非必要保持中性 — 一眼分辨
- 金額用 `font-variant-numeric: tabular-nums`、`font-weight: 800`
- 日期/標籤用 10.5px、`text-muted`、`·` 分隔
- 移除每個 item 的 cyan glow

---

## Phase 3 — 底部導覽 + Header

### 3.1 BottomNav（`src/composites/BottomNav.tsx`）
- 把「+」FAB 從目前位置移到**置中**（5 個 nav item 變成「2 + FAB + 2」結構）
- FAB 56×56、漸層 `linear-gradient(135deg, #06B6D4, #0891B2)`、`box-shadow: 0 8px 24px rgba(6,182,212,.4)`
- Nav item active 狀態：emoji/icon 上方加 4px 高度的小圓點（pill）取代整體背景變色
- Container：`backdrop-filter: blur(20px)` + `bg: rgba(10,14,26,.7)`，1px top border

### 3.2 Header（`src/composites/Header.tsx`）
- Group selector 與問候語拆開：
  - 第一行：問候語（`早安，K` 18px、`font-weight:700`）+ 日期（11px、muted）
  - 第二行：Group selector pill（border + 12px、icon + 名稱 + caret）+ 通知 icon
- 移除 sticky 半透明 blur，改成單純 solid bg；scroll 時加 1px bottom border

---

## Phase 4 — 新增/編輯帳目 Modal

> 對應檔：`src/composites/EditExpenseModal.tsx`、`src/composites/EditRecordContainer.tsx`、`src/components/NumberKeyboard.tsx`、`src/app/edit/page.tsx`

### 4.1 整體結構（bottom sheet）
- 從上而下分區：drag handle / header（取消 + 標題 + 完成）/ **大金額顯示** / 收支必要 segments / 類別網格 / 描述輸入 / 計算機鍵盤
- Sheet 圓角頂部 `24px`、整體 `max-height: 95%`、可下滑關閉

### 4.2 大金額顯示
- 字級 48–56px、`font-weight: 800`、`font-variant-numeric: tabular-nums`
- 收入時用 income 綠，支出時保持 text-primary 色（不要支出用紅，紅留給「超支警示」）
- 上方 eyebrow 標 `支出金額` / `收入金額`，顏色對應
- 金額下方加 4 顆「快速金額」chip：`+100 / +500 / +1000 / +5000`（點擊累加）

### 4.3 計算機鍵盤（`NumberKeyboard.tsx`）
- **重點**：改成標準計算機排序：
  ```
  7  8  9  ÷
  4  5  6  ×
  1  2  3  −
  .  0  ⌫  +/✓
  ```
- 確認鍵（最右下）漸層主色 + checkmark icon，按下後關閉 sheet 並儲存
- ⌫ 按鍵微微帶 `expense` 色提示
- 按鍵高度 50–56px、圓角 14px、間距 6–8px

### 4.4 類別選擇
- 由 dropdown / select 改為 5×N 網格按鈕（emoji + label）
- 選中：`bg: linear-gradient(180deg, rgba(6,182,212,.18), rgba(6,182,212,.04))` + `border: rgba(6,182,212,.5)` + label 變主色
- 沒選中：subtle bg + 1px line border

### 4.5 描述輸入
- Input 下方加常用詞 chip（從 `FavoriteCategoriesProvider` 取）：早餐/午餐/晚餐/點心/飲料 等

---

## Phase 5 — 預算頁 Budget

> 對應檔：`src/app/budget/page.tsx`、`AnnualBudgetSection.tsx`、`MonthlyBudgetSection.tsx`、`MonthlyBudgetBlocks.tsx`、`MonthlyItemsList.tsx`

### 5.1 頁面 Hero
- 新增頁面標題「預算規劃」+ 副文字「2026 年 · 4 月」

### 5.2 年度 / 月度雙卡
- 改為兩張並排卡：
  - 年度卡：subtle bg、白色標題 + 數字 + 4px 進度條
  - 月度卡：主色弱漸層 bg + 主色 border、強調當前月

### 5.3 類別預算列表
- 每張 card：左 emoji（34×34 圓角 10px）+ 中間 label + 右金額
- 進度條 4px、圓角、track `rgba(255,255,255,.06)`：
  - `< 80%` → `MONEY_COLORS.primary`
  - `80–99%` → `MONEY_COLORS.warning`
  - `≥ 100%` → `MONEY_COLORS.overBudget` + card border 改為 `rgba(248,113,113,.3)`
- 進度條下方加 `XX% 已使用` + 右側 `剩餘 $X` 或 `超支 $X`（紅）
- 移除每張卡的 glow

### 5.4 新增類別預算
- 列表頂部加「+ 新增」inline 按鈕（主色文字、無框）

---

## Phase 6 — 統一細節調整（全站）

| 細節 | 修改 |
|---|---|
| 卡片陰影 | 從多重陰影壓到 `box-shadow: 0 1px 0 rgba(255,255,255,.04) inset, 0 8px 20px rgba(0,0,0,.25)` |
| 圓角 | Card `14–18px`、Tile `12px`、Button `10–12px`、Pill `99px`（一致化） |
| Border | 統一 `1px solid var(--color-line)`（建議 `rgba(255,255,255,.06)`），soft 變體 `rgba(255,255,255,.04)` |
| Glow 用量 | 只留：FAB / 主進度條 / 確認按鈕 / 必要支出 emoji 內陰影 — 其他全部拿掉 |
| 字體 | 數字一律加 `font-variant-numeric: tabular-nums`，避免跳動 |
| Eyebrow 樣式 | 11px、`font-weight:600`、`letter-spacing:.12em`、`color: text-muted` |
| `text-wrap: pretty` | 段落文字加上，避免孤行 |

---

## 驗收清單（每個 Phase 跑一次）

- [ ] `npm run lint` 通過
- [ ] `npm run build` 通過
- [ ] 手機尺寸（375 / 390）視覺正確、無水平 scroll
- [ ] Tablet（768）與 Desktop（1280）不破版
- [ ] 點 hero 結餘、收支卡、預算列表 → 進對應頁
- [ ] 新增帳目 → 計算機 → 確認 → 列表立即出現新項
- [ ] 預算頁三色（primary / warning / overBudget）依百分比正確切換
- [ ] Light/Dark mode 一致（如果有 light mode 的話）

---

## 建議執行順序

1. **Phase 1**（Token 修正）— 全站影響，先做。**約 30 分鐘**
2. **Phase 6**（細節統一）的 `Glow 用量` 與 `Border` 部分先做 — 全站立即受益。**約 20 分鐘**
3. **Phase 3**（BottomNav + Header）— 視覺改變最明顯，動到全站 layout。**約 40 分鐘**
4. **Phase 2**（Dashboard）。**約 60 分鐘**
5. **Phase 4**（Edit Modal）— 最重的一塊，鍵盤排序變更須測試。**約 90 分鐘**
6. **Phase 5**（Budget）。**約 40 分鐘**
7. **Phase 6** 剩餘細節 + 整體 QA。**約 30 分鐘**

預估總時數：**5 小時**。

---

## 給 Claude Code 的提示語範例

把這份檔案丟進 repo（例如放 `docs/UI_REFINED_A.md`），然後在 Claude Code 跟它說：

> 我有一份 `docs/UI_REFINED_A.md`，請依照 Phase 1 → Phase 6 的順序逐步執行。每完成一個 Phase 先停下來讓我看 diff，再進下一個。所有顏色都用 `src/styles/colors.ts` 的 token，不要硬編碼。
