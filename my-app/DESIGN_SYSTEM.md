# Spending Tracker PWA - Design System

## 設計理念
打造一個**神秘、科技感的記帳應用**，靈感來自《獨自升級》（Solo Leveling）的視覺風格。採用深色背景搭配青藍色與紫色發光效果，營造沉浸式的使用體驗。設計重點在於移動優先（Mobile-First）、快速操作，同時保持桌面版的完整分析功能。

---

## 色彩系統 (Color Palette)

### 主色系 - 青藍色 (Cyan)
靈感來自獨自升級中的發光效果，青藍色代表力量與科技感。

```css
/* Primary - 青藍色 */
--color-primary-50: #ECFEFF;
--color-primary-100: #CFFAFE;
--color-primary-200: #A5F3FC;
--color-primary-300: #67E8F9;
--color-primary-400: #22D3EE;
--color-primary-500: #06B6D4;  /* 主色 */
--color-primary-600: #0891B2;
--color-primary-700: #0E7490;
--color-primary-800: #155E75;
--color-primary-900: #164E63;
--color-primary-950: #083344;

/* Secondary - 紫色（神秘魔力感） */
--color-secondary-50: #FAF5FF;
--color-secondary-100: #F3E8FF;
--color-secondary-200: #E9D5FF;
--color-secondary-300: #D8B4FE;
--color-secondary-400: #C084FC;
--color-secondary-500: #A855F7;  /* 副色 */
--color-secondary-600: #9333EA;
--color-secondary-700: #7C3AED;
--color-secondary-800: #6B21A8;
--color-secondary-900: #581C87;

/* Accent - 電光藍 */
--color-accent-50: #EFF6FF;
--color-accent-100: #DBEAFE;
--color-accent-200: #BFDBFE;
--color-accent-300: #93C5FD;
--color-accent-400: #60A5FA;
--color-accent-500: #3B82F6;  /* 輔助色 */
--color-accent-600: #2563EB;
--color-accent-700: #1D4ED8;
--color-accent-800: #1E40AF;
--color-accent-900: #1E3A8A;

/* 收入 - 翡翠綠 */
--color-income-50: #ECFDF5;
--color-income-100: #D1FAE5;
--color-income-200: #A7F3D0;
--color-income-300: #6EE7B7;
--color-income-400: #34D399;
--color-income-500: #10B981;  /* 收入色 */
--color-income-600: #059669;
--color-income-700: #047857;
--color-income-800: #065F46;
--color-income-900: #064E3B;
```

### 中性色系 - 冷灰調 (Slate)
```css
/* Slate Grays - 冷色調灰色 */
--color-gray-50: #F8FAFC;
--color-gray-100: #F1F5F9;
--color-gray-200: #E2E8F0;
--color-gray-300: #CBD5E1;
--color-gray-400: #94A3B8;
--color-gray-500: #64748B;
--color-gray-600: #475569;
--color-gray-700: #334155;
--color-gray-800: #1E293B;
--color-gray-900: #0F172A;
--color-gray-950: #020617;
```

### 語義化顏色
```css
/* Semantic Colors */
--color-success: #34D399;
--color-warning: #FBBF24;
--color-error: #F87171;
--color-info: #60A5FA;

/* Background - 深色主題 */
--color-bg-primary: #0A0E1A;      /* 深邃夜空 */
--color-bg-secondary: #111827;    /* 稍亮的深色 */
--color-bg-elevated: #1E293B;     /* 卡片背景 */

/* Text - 深色主題 */
--color-text-primary: #F1F5F9;    /* 主要文字 - 淺色 */
--color-text-secondary: #94A3B8;  /* 次要文字 */
--color-text-tertiary: #64748B;   /* 提示文字 */
--color-text-inverse: #0F172A;    /* 反色文字 */

/* Border - 深色主題 */
--color-border-light: #1E293B;
--color-border-default: #334155;
--color-border-strong: #475569;
```

### 發光陰影效果
```css
/* Glow Shadows - Solo Leveling 風格 */
--shadow-glow: 0 0 20px 0 rgba(34, 211, 238, 0.15);
--shadow-glow-lg: 0 0 40px 0 rgba(34, 211, 238, 0.25);
--shadow-glow-purple: 0 0 30px 0 rgba(168, 85, 247, 0.2);
--shadow-glow-intense: 0 0 60px 0 rgba(34, 211, 238, 0.35);
```

### 圖表專用色彩（深色背景優化）
```css
--chart-color-1: #06B6D4;  /* 青 */
--chart-color-2: #A855F7;  /* 紫 */
--chart-color-3: #3B82F6;  /* 藍 */
--chart-color-4: #22D3EE;  /* 淺青 */
--chart-color-5: #C084FC;  /* 淺紫 */
--chart-color-6: #10B981;  /* 翡翠綠 */
--chart-color-7: #60A5FA;  /* 淺藍 */
--chart-color-8: #F472B6;  /* 粉紅 */
```

---

## 字體系統 (Typography)

### 字體家族
```css
/* 使用 Poppins（標題）+ Open Sans（內文） */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap');

--font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'SF Mono', 'Consolas', 'Monaco', monospace;
```

### 字體大小（響應式設計）
```css
/* Mobile First */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px - 最小可讀尺寸 */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */

/* Desktop adjustments */
@media (min-width: 768px) {
  --text-base: 1.0625rem;  /* 17px */
  --text-4xl: 2.5rem;      /* 40px */
  --text-5xl: 3.5rem;      /* 56px */
}
```

### 字重（Font Weight）
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### 行高（Line Height）
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose: 2;
```

---

## 間距系統 (Spacing)

使用 8px 基礎單位的間距系統：

```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

---

## 圓角系統 (Border Radius)

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* 完全圓形 */
```

---

## 陰影系統 (Shadows)

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* 暖色投影（橙色調） */
--shadow-warm: 0 4px 14px 0 rgba(249, 115, 22, 0.15);
--shadow-warm-lg: 0 10px 30px 0 rgba(249, 115, 22, 0.2);
```

---

## 動畫系統 (Animations)

### 過渡時間
```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;
```

### 緩動函數
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 關鍵動畫
```css
/* 淡入淡出 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* 滑動進入 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 彈跳進入 */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

/* 脈衝（用於強調） */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
```

---

## 元件設計原則

### 1. 按鈕 (Buttons)

**規格：**
- 最小觸控尺寸：44×44px
- 圓角：`--radius-lg` (12px)
- 字重：`--font-semibold` (600)
- 過渡：`--duration-normal` (250ms)

**變體：**
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-warm);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%);
  box-shadow: var(--shadow-warm-lg);
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: var(--color-bg-elevated);
  color: var(--color-primary-600);
  border: 2px solid var(--color-primary-200);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--color-primary-600);
}
```

### 2. 卡片 (Cards)

**規格：**
- 圓角：`--radius-xl` (16px)
- 內距：`--spacing-6` (24px)
- 背景：`var(--color-bg-elevated)`
- 陰影：`var(--shadow-md)`
- 邊框：1px solid `var(--color-border-light)`

**樣式：**
```css
.card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-light);
  transition: all var(--duration-normal) var(--ease-out);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* 暖色漸層卡片（用於強調區域） */
.card-gradient {
  background: linear-gradient(135deg,
    var(--color-primary-50) 0%,
    var(--color-accent-50) 100%);
}
```

### 3. Modal / 彈出視窗

**規格：**
- 最大寬度：Mobile 100%, Desktop 600px
- 圓角：`--radius-2xl` (24px)
- 遮罩：`rgba(0, 0, 0, 0.6)`
- 動畫：slideInUp + fadeIn

**標題欄：**
- 暖色漸層背景
- 高度：60px
- 字體：Poppins, 600 weight

### 4. 表單元素

**Input / Select：**
- 高度：48px（移動）/ 44px（桌面）
- 圓角：`--radius-lg` (12px)
- 邊框：2px solid `var(--color-border-default)`
- Focus：邊框變為 `var(--color-primary-500)`，添加 `--shadow-warm`

**NumberKeyboard：**
- 按鍵尺寸：最小 56×56px
- 圓角：`--radius-xl`
- Hover 效果：背景變亮 + 輕微放大（scale: 1.05）

### 5. 導航欄

**BottomNav（移動）：**
- 高度：64px
- 背景：毛玻璃效果 `backdrop-blur-xl`
- 中央按鈕：突出設計，圓形，直徑 56px
- 圖標間距：確保每個觸控區域 ≥ 44×44px

**AsideMenu（桌面）：**
- 寬度：280px
- 背景：暖色漸層
- 使用者頭像：圓形，直徑 80px，帶 4px 白色邊框

**Header：**
- 高度：64px
- 固定頂部，毛玻璃背景
- Logo + 帳本選擇器居中對齊

---

## 響應式斷點 (Breakpoints)

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* 小型手機以上 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 1024px;  /* 小型桌面 */
--breakpoint-xl: 1280px;  /* 桌面 */
--breakpoint-2xl: 1536px; /* 大螢幕 */
```

**佈局策略：**
- **< 768px**: 單欄，BottomNav，全螢幕 Modal
- **≥ 768px**: 雙欄，開始顯示 AsideMenu，Modal 縮小至 600px
- **≥ 1024px**: 完整桌面體驗，AsideMenu 固定顯示

---

## 無障礙設計 (Accessibility)

### 對比度
- 正常文字：最小 4.5:1
- 大文字（≥18px 或 ≥14px bold）：最小 3:1
- UI 元件：最小 3:1

### 觸控目標
- 最小尺寸：44×44px
- 元素間距：最小 8px

### 焦點狀態
```css
*:focus-visible {
  outline: 3px solid var(--color-primary-400);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}
```

### 動畫尊重
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 圖示系統

**使用 SVG 圖示，不使用 Emoji**
- 現有圖示庫：`/components/icons/`
- 尺寸：24×24px（標準）、20×20px（小）、32×32px（大）
- 顏色：繼承父元素 `currentColor`

**圖示風格：**
- 線條粗細：2px
- 圓角：適度圓角
- 風格：簡約、現代

---

## 圖表設計

### 使用 Recharts 的配色
```javascript
const CHART_COLORS = [
  '#F97316', // 橙
  '#EF4444', // 紅
  '#F59E0B', // 金
  '#EC4899', // 粉紅
  '#A855F7', // 紫
  '#3B82F6', // 藍
  '#22C55E', // 綠
  '#14B8A6', // 青
];
```

### 圖表樣式
- 背景：`var(--color-bg-elevated)`
- 網格線：`var(--color-border-light)`，虛線
- 工具提示：圓角卡片，`--shadow-lg`
- 圖例：使用 Poppins，500 weight

---

## 頁面佈局

### Dashboard（首頁）
- 概覽卡片（預算、支出、收入）：3 欄網格（桌面）/ 單欄（移動）
- 日常成本圖表：全寬，高度 300px
- 快速導航卡片：2×2 網格
- 最近交易：列表，最多 10 筆

### Transactions（帳目）
- 篩選器：固定頂部
- 交易列表：虛擬化滾動（優化效能）
- 交易卡片：圓角，左側色條表示類別

### Analysis（分析）
- 圖表堆疊：單欄（移動）/ 雙欄（桌面）
- 圖表卡片：均等高度，統一樣式
- 表格：響應式，移動端橫向滾動

### Budget（預算）
- 年度總覽：頂部，大數字顯示
- 月度預算：網格佈局，進度條
- 進度條：暖色漸層，動畫填充

### Group（帳本管理）
- 帳本卡片：大卡片，點擊進入
- 成員列表：頭像 + 名稱
- 邀請功能：QR Code + 連結

---

## 效能優化

### 圖片
- 使用 Next.js `<Image>` 組件
- 格式：WebP with fallback
- 懶加載：`loading="lazy"`

### 字體
- `font-display: swap`
- 預加載關鍵字體

### 動畫
- 使用 `transform` 和 `opacity`
- 避免觸發 layout 或 paint
- 60fps 目標

### Bundle
- 動態導入重型組件（如 Recharts）
- Code splitting per route
- Tree shaking

---

## 實作檢查清單

### 開始前
- [ ] 安裝 Google Fonts（Poppins + Open Sans）
- [ ] 更新 Tailwind 配置
- [ ] 更新 CSS 變數

### 組件更新
- [ ] Modal（暖色標題欄）
- [ ] ActionMenu（統一圓角和陰影）
- [ ] AsideMenu（暖色漸層背景）
- [ ] BottomNav（毛玻璃效果）
- [ ] Header & Caption（固定頂部 + 毛玻璃）
- [ ] InputBox（新樣式）
- [ ] Select（新樣式）
- [ ] DatePicker（新樣式）
- [ ] NumberKeyboard（更大按鍵）

### 頁面更新
- [ ] Dashboard（新卡片樣式）
- [ ] Transactions（新列表樣式）
- [ ] Analysis（圖表配色）
- [ ] Budget（進度條樣式）
- [ ] Group（卡片佈局）

### 測試
- [ ] 響應式測試（375px, 768px, 1024px, 1440px）
- [ ] 對比度檢查（WebAIM Contrast Checker）
- [ ] 觸控目標檢查（最小 44×44px）
- [ ] 鍵盤導航測試
- [ ] 動畫效能測試（Chrome DevTools）
- [ ] 減少動畫偏好測試

---

## 參考資源

- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Recharts Documentation](https://recharts.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design - Touch Targets](https://m2.material.io/design/usability/accessibility.html#layout-and-typography)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

**版本**: 1.0
**最後更新**: 2026-01-16
**作者**: Claude Code with UI/UX Pro Max
