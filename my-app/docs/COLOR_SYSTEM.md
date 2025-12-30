# 🎨 色彩系統指南

## 主色調 - Purple (#663399)

### Primary Colors
主要品牌色，用於主要按鈕、連結、重要強調元素

```css
--color-primary-50: hsl(270, 50%, 98%)   /* 極淺紫 - 背景 */
--color-primary-100: hsl(270, 50%, 95%)  /* 淺紫 - hover 背景 */
--color-primary-200: hsl(270, 50%, 85%)  /* 柔和紫 - 裝飾 */
--color-primary-300: hsl(270, 50%, 70%)  /* 中淺紫 - 次要元素 */
--color-primary-400: hsl(270, 50%, 55%)  /* 中紫 - hover 狀態 */
--color-primary-500: hsl(270, 50%, 40%)  /* #663399 主色 ⭐ */
--color-primary-600: hsl(270, 50%, 32%)  /* 深紫 - active 狀態 */
--color-primary-700: hsl(270, 50%, 24%)  /* 更深紫 - 文字 */
--color-primary-800: hsl(270, 50%, 16%)  /* 暗紫 - 深色背景 */
--color-primary-900: hsl(270, 50%, 10%)  /* 極深紫 */
```

**使用場景**:
- `primary-500`: 主要按鈕、重要 CTA、品牌標誌
- `primary-600`: 按鈕 hover 狀態
- `primary-700`: 按鈕 active/pressed 狀態
- `primary-100`: 淺色背景、卡片 hover
- `primary-50`: 極淺背景、區塊分隔

---

## 輔助色系 - Accent Colors

### 1. Lavender（薰衣草紫）
同色系輔助色，用於次要強調

```css
--color-accent-lavender-100: hsl(250, 60%, 95%)
--color-accent-lavender-500: hsl(250, 60%, 70%)
```

**使用場景**:
- 標籤、徽章
- 次要資訊區塊
- 漸層效果輔助色

### 2. Orchid（蘭花紫）
偏紅的紫色，用於溫暖對比

```css
--color-accent-orchid-100: hsl(300, 47%, 95%)
--color-accent-orchid-500: hsl(300, 47%, 65%)
```

**使用場景**:
- 漸層終點色
- 圖表數據點
- 裝飾性元素

### 3. Mint（薄荷綠）
互補色，用於成功狀態和清新對比

```css
--color-accent-mint-100: hsl(150, 40%, 95%)
--color-accent-mint-500: hsl(150, 40%, 55%)
```

**使用場景**:
- 成功提示
- 正向數據（收入、成長）
- 完成狀態

### 4. Peach（桃色）
溫暖對比色，用於警示和溫暖氛圍

```css
--color-accent-peach-100: hsl(20, 80%, 95%)
--color-accent-peach-500: hsl(20, 80%, 70%)
```

**使用場景**:
- 警告提示
- 負向數據（支出、下降）
- 需要注意的資訊

---

## 色彩搭配建議

### 漸層組合

#### 主要漸層（紫到蘭花紫）
```css
background: linear-gradient(135deg,
  var(--color-primary-500) 0%,
  var(--color-accent-orchid-500) 100%
);
```
**效果**: 優雅、專業、品牌感強

#### 清新漸層（紫到薄荷綠）
```css
background: linear-gradient(135deg,
  var(--color-primary-400) 0%,
  var(--color-accent-mint-500) 100%
);
```
**效果**: 活力、清新、現代感

#### 溫暖漸層（紫到桃色）
```css
background: linear-gradient(135deg,
  var(--color-primary-500) 0%,
  var(--color-accent-peach-500) 100%
);
```
**效果**: 溫暖、友善、親和力

---

## 配色原則

### 1. 60-30-10 法則
- **60%**: primary-50/100/200（淺色背景）
- **30%**: gray 系列（文字、邊框）
- **10%**: primary-500/600（強調元素）

### 2. 對比度要求
- 主要文字 vs 背景: 至少 4.5:1
- 大標題 vs 背景: 至少 3:1
- 按鈕文字 vs 按鈕背景: 至少 4.5:1

### 3. 無障礙設計
```css
/* 焦點環 */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

---

## 實際應用範例

### 按鈕
```css
.submit-button {
  background-color: var(--color-primary-500);
  color: white;
}

.submit-button:hover {
  background-color: var(--color-primary-600);
}

.submit-button:active {
  background-color: var(--color-primary-700);
}
```

### 卡片
```css
.card {
  background: white;
  border: 1px solid var(--color-gray-200);
}

.card:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(102, 51, 153, 0.1);
}
```

### 標籤
```css
/* 主要標籤 */
.tag-primary {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

/* 成功標籤 */
.tag-success {
  background: var(--color-accent-mint-100);
  color: hsl(150, 50%, 30%);
}

/* 警告標籤 */
.tag-warning {
  background: var(--color-accent-peach-100);
  color: hsl(20, 70%, 40%);
}
```

### 背景漸層
```css
.bg-soft {
  background-color: #fafbfc;
  background-image:
    radial-gradient(
      circle at 10% 10%,
      rgba(102, 51, 153, 0.15) 0%,
      transparent 70%
    ),
    radial-gradient(
      circle at 90% 90%,
      rgba(138, 99, 210, 0.12) 0%,
      transparent 70%
    );
}
```

---

## 圖表配色

### 推薦色彩順序
1. `--color-primary-500` (#663399) - 主要數據
2. `--color-accent-mint-500` - 正向數據
3. `--color-accent-peach-500` - 警示數據
4. `--color-accent-orchid-500` - 次要數據
5. `--color-accent-lavender-500` - 補充數據

### 範例
```typescript
const chartColors = [
  'hsl(270, 50%, 40%)',  // Primary purple
  'hsl(150, 40%, 55%)',  // Mint green
  'hsl(20, 80%, 70%)',   // Peach
  'hsl(300, 47%, 65%)',  // Orchid
  'hsl(250, 60%, 70%)',  // Lavender
];
```

---

## 深色模式（未來）

為深色模式預留的變數：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: hsl(270, 20%, 8%);
    --color-text: hsl(0, 0%, 95%);
    --color-primary-500: hsl(270, 50%, 55%); /* 調亮 */
  }
}
```

---

## 快速參考

### 常用組合
| 用途 | 前景色 | 背景色 |
|------|--------|--------|
| 主要按鈕 | white | primary-500 |
| 次要按鈕 | primary-700 | primary-100 |
| 成功訊息 | hsl(150, 50%, 30%) | accent-mint-100 |
| 警告訊息 | hsl(20, 70%, 40%) | accent-peach-100 |
| 卡片 hover | - | primary-50 |

---

**最後更新**: 2025-12-30
**主色**: #663399 (Purple)
**設計理念**: 優雅、專業、現代
