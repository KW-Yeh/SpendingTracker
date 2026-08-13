# Analysis Dashboard Expansion Plan

## Requirement

Replace the analysis page's nested doughnut charts with a mobile-first dashboard that helps users understand current spending, changes over time, category drivers, necessity mix, and budget pressure. The implementation must support deterministic mock-data verification because the development environment cannot access production data.

## Scope

- Add summary KPIs for spending, month-over-month change, net balance, and budget usage.
- Add a rolling 12-month spending chart with a 3-month moving average and monthly budget reference.
- Add a category month-over-month change chart.
- Add a 6-month necessary-versus-extra spending share chart.
- Replace the budget doughnut with per-category budget progress bars that show overruns.
- Fetch 13 months of live records through the existing items API without overwriting `SpendingProvider` state.
- Add `/analysis?mock=1` as a deterministic UI verification mode that performs no analysis data fetch.

## Boundaries

- Do not change the database schema, SQL functions, authenticated-route behavior, provider order, transaction CRUD, or budget editing behavior. The public mock route may skip the login redirect because it cannot access real records.
- Do not add dependencies or edit the lockfile.
- Do not redesign other routes.
- Do not stage or commit `agent_memory.db` or `graphify-out/`.

## Acceptance Checks

1. Open `/analysis?mock=1` at 375, 768, and 1440 pixels wide.
2. Confirm the four KPI labels and mock-mode banner are visible.
3. Confirm the 12-month trend, category change, necessity trend, and budget progress sections render.
4. Confirm Recharts SVG content exists for all three chart sections.
5. Confirm at least one over-budget category and both positive and negative category changes are rendered.
6. Confirm there is no horizontal document overflow at any target width.
7. Confirm the page emits no browser console errors and makes no `/api/aurora/items` request in mock mode.
8. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` from `my-app/`.

## Regression Checks

- Live mode still requires a selected group and shows the existing empty state when none exists.
- Month navigation updates the selected analysis period.
- API responses retain the existing `{ status, data, message }` client service contract.

## Environment

- App commands run from `my-app/` as required by `AGENTS.md`.
- Browser verification uses Python Playwright and the repository dev server.
- The implementation is intentionally performed on `main` and pushed to `origin/main` per user instruction.
