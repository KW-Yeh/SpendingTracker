# AGENTS.md — SpendingTracker

Project-specific playbook for autonomous agents (Claude Code, Codex, etc.). Extends the
global workflow with this repo's stack, commands, and Definition of Done.

SpendingTracker is a **mobile-first PWA** for expense tracking with Traditional Chinese UI.
It uses Next.js 16 App Router, AWS Aurora DSQL, NextAuth v5 (Google + LINE OAuth), and
a React Context layer for client state. The design system follows the Apple-style light
theme defined in `DESIGN.md`.

Read `CLAUDE.md` first for full architecture details. This file is the **agent operations
manual** — commands, invariants, and gotchas that prevent common mistakes.

---

## Tech stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + PostCSS; Prettier + `prettier-plugin-tailwindcss`
- **Auth**: NextAuth v5 — Google + LINE OAuth, JWT session strategy; `userId` (integer) always on session token
- **Database**: AWS Aurora DSQL (PostgreSQL-compatible) via `my-app/src/utils/getAurora.ts`
- **State**: React Context (7-layer provider stack; see `CLAUDE.md`)
- **PWA**: Service worker at `my-app/public/sw.js` (network-first caching for API routes)
- **E2E**: Playwright (repo-root ad-hoc scripts only; no formal runner)
- **Package manager**: npm

---

## Commands

All npm / tsc commands must be run from `my-app/`. Playwright scripts run from repo root.

| Task | Command | Notes |
|---|---|---|
| Dev server | `cd my-app && npm run dev` | localhost:3000 |
| Production build | `cd my-app && npm run build` | Required for DoD |
| Lint | `cd my-app && npm run lint` | ESLint; required for DoD |
| Typecheck | `cd my-app && npx tsc --noEmit` | No npm script; run directly |
| Format single file | `cd my-app && npx prettier --write <file>` | No format npm script |
| Playwright (ad-hoc) | Run from repo root; target Chrome on `--remote-debugging-port=9222` | Skips OAuth re-auth |

---

## Project structure

```
my-app/src/
├── app/                  Next.js App Router pages + page-specific components
│   ├── api/aurora/       All API routes (DB-backed, server-only)
│   └── @modal/           Parallel route — intercepted edit modal
├── composites/           Multi-concern composed components (Header, BottomNav, etc.)
├── components/           Reusable primitives (Accordion, ActionMenu, icons, etc.)
├── context/              React context providers
├── hooks/                Custom hooks
├── services/             Server-side DB queries (*.ts) + client-side fetch wrappers (*Services.ts)
├── styles/colors.ts      Chart palette + UI color constants (Apple light-theme tokens)
├── types/type.d.ts       Ambient global types — no import needed
├── utils/                Pure utility functions + constants
└── config/features.ts    Feature flags: optimized vs legacy query mode
```

---

## Architecture invariants

These are the rules agents must not violate. For deeper context, see `CLAUDE.md`.

- **`cd my-app` before every command.** The repo root has no `package.json` for the app. Running npm from root silently fails or hits the wrong scope.
- **`getAurora.ts` is the only DB entry point.** `getPool()` for API routes (singleton), `getDb()` for one-shot queries. The file is `server-only` — never import from client components.
- **API routes return `{ status: boolean, data?, message? }`.** Do not invent a different response shape.
- **Provider order is fixed.** `SessionProvider → DateProvider → GroupProvider → UserConfigProvider → FavoriteCategoriesProvider → SpendingProvider → BudgetProvider`. Inner providers depend on outer ones; reordering causes silent context failures.
- **All global types live in `src/types/type.d.ts` (ambient).** Never duplicate type definitions; never add a new `types/` file without removing the duplicate.
- **New feature flow:** `src/services/*.ts` (server DB) → `src/app/api/aurora/` (route) → `src/services/*Services.ts` (client fetch) → context/hook → component.
- **Before touching DB queries:** check `src/config/features.ts` — all flags are currently `true` (optimized single-function SQL). If you add a new DB call, add it to the optimized path. Do not silently fall back to legacy.
- **Design system is Apple-style light (DESIGN.md).** Use token classes (`bg-background`, `text-foreground`, Action Blue `#0066cc`, hairline borders). No dark-mode overrides, no decorative gradients, no glow shadows on chrome.

---

## Definition of Done

A change is done only when:

1. `cd my-app && npm run lint` — passes with no errors.
2. `cd my-app && npx tsc --noEmit` — passes with no errors.
3. `cd my-app && npm run build` — succeeds.
4. For UI or behavioral changes: verified in the running dev server (`npm run dev`) at localhost:3000.

---

## Runtime verification

- **Standard:** `cd my-app && npm run dev`, open localhost:3000, exercise the changed flow.
- **OAuth / session changes:** Launch Chrome with `--remote-debugging-port=9222` and reuse the existing login session. Then author a Playwright script at repo root connecting to that port.
- **API changes:** DevTools → Network, confirm the route returns `{ status: true, data: ... }`.
- **PWA / service worker:** Hard-refresh or use DevTools → Application → Service Workers → "Update on reload" to bypass SW cache.
- **Build verification:** `npm run build` must succeed before the task is considered done.

---

## Gotchas

- **Wrong cwd.** Commands run from repo root instead of `my-app/` either fail silently or affect the wrong package. Always `cd my-app` first.
- **`server-only` boundary.** Any file that imports `getAurora.ts` (directly or transitively) will throw a build error if imported in a client component. Keep DB access in `src/services/*.ts` and `src/app/api/` only.
- **Provider order dependency.** `SpendingProvider` reads `currentGroup` from `GroupProvider`. Moving providers breaks data flow without a visible error at module load time.
- **Feature flag mode.** `src/config/features.ts` currently sets all flags to `true` (optimized). Adding a new legacy-path query while a flag is `true` means it will never run — check the flag before writing new DB query code.
- **UI design invariants (regressions have occurred before):**
  - The transactions sort/search bar uses `bg-background` — this is intentional (blends with page, not a card).
  - The category `Select` inside the edit modal closes on `Escape`, not on item-click — `useFocusRef` would otherwise close the dropdown mid-async-operation.
  - `.animate-modal` has no `animation-fill-mode: forwards` — adding it back causes `position: fixed` dropdowns inside the modal to miscalculate viewport offsets.
- **TypeScript stale cache.** If `npx tsc --noEmit` reports phantom "Duplicate identifier" errors, delete `my-app/.next` and re-run.

---

## Git / PR

- Commit messages in English; conventional-commit prefixes (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- End commit body with `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` (or whichever model).
- Do not push unless asked. Do not `npm install` new dependencies without flagging it first.
- Main branch: `main`. Feature branches: `feature/<name>`.

---

## Reference docs

- `CLAUDE.md` — full architecture reference: Database, Auth, Context Providers, API Routes, Services, Pages, Component Organization, Key Types, Styling.
- `DESIGN.md` — Apple-style design language (color tokens, typography, spacing, component specs). The UI has already been restyled to follow this system (see commit `750a187`). Use it when adding or modifying UI components.
