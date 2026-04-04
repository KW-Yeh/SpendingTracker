# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Location

All source code lives under `my-app/`. Run all commands from that directory.

```bash
cd my-app
```

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

Prettier is configured with single quotes and `prettier-plugin-tailwindcss` for automatic class sorting. There is no explicit format script — run `npx prettier --write <file>` manually.

## E2E Testing (Playwright + Chrome CDP)

Tests use [Playwright](https://playwright.dev/) to connect to an **already-running Chrome** session via CDP, avoiding Google OAuth re-authentication.

### Prerequisites

1. Install Playwright (from project root, not `my-app/`):
   ```bash
   npm install playwright
   npx playwright install chromium
   ```

2. Start the dev server:
   ```bash
   cd my-app && npm run dev
   ```

3. Launch Chrome with remote debugging (closes any existing Chrome first):
   ```bash
   pkill -x "Google Chrome"; sleep 1 && open -a "Google Chrome" --args --remote-debugging-port=9222
   ```

4. Log in via Google OAuth in the browser that opens, then run the test:
   ```bash
   # From project root
   node playwright-auth-test.cjs
   ```

Screenshots are saved to `/tmp/pw-*.png`.

### What is tested

| Suite | Checks |
|-------|--------|
| Auth check | Already logged in; selects 個人帳本; pins `currentGroupId` cookie |
| Dashboard | Header, greeting, group selector, bottom nav, quick nav cards, recent transactions, year/month filter |
| Group selector dropdown | Opens, renders items in viewport, closes on select |
| Bottom nav active state | Each route (`/`, `/transactions`, `/analysis`, `/budget`, `/group`) highlights correctly |
| Transactions page | Sort dropdown (not clipped), real-time search (`input` event), action menu (edit/delete links) |
| /edit modal — new | Switch toggle, category Select (viewport-bounded), date picker, description + common-desc dropdown, number keyboard (input/backspace/clear), zero-amount validation, cancel |
| Edit existing transaction | Navigates to `/edit?id=`, shows 編輯帳目 title |
| Budget page | Loads without error |
| Analysis page | Loads without error |
| Group page | Loads without error |
| Responsive | Dashboard renders at tablet (768 px) and desktop (1440 px) |

### Known design decisions captured by tests

- Sort/search bar uses `bg-background` intentionally (blends with page, not a card).
- Category Select inside the modal uses `Escape` to close rather than item-click, because `useFocusRef` closes the dropdown between async Playwright operations.
- `animation-fill-mode: forwards` was removed from `.animate-modal` — the `transform` it left behind made `position: fixed` dropdowns inside the modal calculate viewport offsets incorrectly.

## Architecture Overview

This is a **Next.js 15 App Router** spending tracker PWA (Traditional Chinese UI) targeting mobile-first usage.

### Database

The backend connects to **AWS Aurora DSQL** (PostgreSQL-compatible) or a standard PostgreSQL database via `src/utils/getAurora.ts`. It exports `getPool()` (singleton connection pool) and `getDb()` (single client). All API routes import this using `server-only`.

Connection is configured via environment variables — either `DATABASE_URL` (simplest) or individual `PGHOST`/`PGUSER`/`PGPASSWORD`/`PGDATABASE`/`PGPORT` vars. For DSQL, set `AURORA_DSQL_HOST`, `AURORA_DSQL_REGION`, `AURORA_DSQL_USER`, `AURORA_DSQL_DB`, plus AWS credentials.

Auth is handled by **NextAuth v5** (via `@/auth`) with Google OAuth. The session user object includes a `userId` (integer from DB).

### Data Layer: Cloud-first + IndexedDB Cache

The app uses a **cloud-first with IDB cache** pattern throughout:
1. Show IDB cache immediately for fast render
2. Fetch from API (source of truth) in parallel
3. Update IDB cache with fresh API response

Mutations use optimistic updates with rollback on error.

The IDB layer is encapsulated in `src/hooks/useIDB.ts`. The IDB store is named `"Expense Tracking"` (version 3 — see `IDB_NAME` / `IDB_VERSION` in `src/utils/constants.ts`).

### Context Providers (Client State)

`src/app/layout.tsx` wraps the app in a nested provider stack (outer to inner):

```
SessionProvider → DateProvider → GroupProvider → UserConfigProvider
  → FavoriteCategoriesProvider → SpendingProvider → BudgetProvider
```

Key contexts:
- **GroupProvider** (`useGroupCtx`) — list of user's "帳本" (accounts/ledger groups), `currentGroup` selection
- **SpendingProvider** (`useGetSpendingCtx`) — current month's `SpendingRecord[]`, CRUD with optimistic updates
- **BudgetProvider** (`useBudgetCtx`) — budget for the current group, auto-syncs when `currentGroup` changes
- **UserConfigProvider** (`useUserConfigCtx`) — logged-in user profile
- **DateProvider** / **FavoriteCategoriesProvider** — selected date context and emoji category favorites

### Initialization Flow

`<PrepareData />` (rendered in layout) runs `usePrepareData` on mount, which:
1. Syncs user profile via `syncUser()`
2. Syncs groups for the user via `syncGroup(user_id)`
3. Sets `currentGroup` from cookie (`currentGroupId`) or first group
4. Creates a default group if user has none
5. Syncs transactions for the current month

### API Routes (`src/app/api/aurora/`)

All API routes use `getPool()` and pattern: `GET/POST/PUT/DELETE` → query DB → return `{ status: boolean, data?, message? }`.

**Feature flags** in `src/config/features.ts` toggle between:
- **Optimized mode** — single SQL function call (e.g., `get_user_dashboard_data()`, `get_budget_page_data()`) — 70–90% faster
- **Legacy mode** — multiple sequential queries

Currently all flags are `true` (optimized). To fall back, set the flag to `false`.

### Services Layer

Two service tiers:
- `src/services/*.ts` — **server-side** direct DB queries (used in API routes): `user.ts`, `group.ts`, `transaction.ts`, `budget.ts`, `favoriteCategories.ts`
- `src/services/*Services.ts` — **client-side** fetch wrappers that call the API routes: `groupServices.ts`, `budgetServices.ts`, `favoriteCategoriesServices.ts`, `userServices.ts`
- `src/services/optimizedServices.ts` — client-side wrappers for the optimized endpoints
- `src/services/optimizedServicesServer.ts` — server component equivalents (use absolute URL via `NEXTAUTH_URL`)

### Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Dashboard (recent transactions overview) |
| `/transactions` | Transaction list + charts, add/edit expense |
| `/analysis` | Pie/bar charts by category and necessity |
| `/budget` | Annual + monthly budget planning |
| `/group` | Ledger group management, invite members |
| `/setting` | User settings, profile |
| `/login` | Google OAuth login |
| `/edit` | Edit expense (also rendered as intercepted modal via `@modal/(.)edit`) |

### Component Organization

- `src/app/<page>/` — page-specific components co-located with the page
- `src/composites/` — multi-concern composed components (Header, Footer, BottomNav, GroupSelector, etc.)
- `src/components/` — reusable primitives (Accordion, ActionMenu, icons, etc.)
- `src/hooks/` — custom hooks
- `src/utils/` — pure utility functions
- `src/context/` — React context providers
- `src/services/` — API/DB service functions
- `src/types/type.d.ts` — global TypeScript types (no import needed — ambient declarations)

### Key Types

All global types are in `src/types/type.d.ts` (ambient, no import needed):
- `SpendingRecord` — a transaction (amount, category emoji, date, necessity, type)
- `Group` — a ledger account shared between users
- `Budget` — annual + monthly budget items per group
- `FavoriteCategories` — per-user favorite emoji category per spending type

`SpendingType` (Income/Outcome) and `Necessity` (必/非) enums are in `src/utils/constants.ts`.

### Styling

Tailwind CSS v4 with PostCSS. Prettier auto-sorts Tailwind classes. Custom color tokens use a `bg-soft` convention (see `src/styles/colors.ts`).
