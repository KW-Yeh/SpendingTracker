# Instant Add-Expense Modal Plan

## Requirement

Make every add-expense trigger feel immediate: after the user presses the add button, the `/edit` modal should appear without waiting for a cold route navigation or an extra post-mount render, and the amount keypad should be interactive as soon as it is visible.

## Scope

- Fully prefetch `/edit` from the mobile FAB, desktop header action, and transactions-page add button.
- Initialize a new spending draft synchronously when `EditRecordContainer` mounts instead of opening it from an effect.
- Preserve delayed edit-record rendering until transaction context data is available.
- Remove the modal's redundant favorite-category refresh because `PrepareData` already owns that synchronization.
- Shorten the modal entrance motion and keep the panel visible from the first animation frame.

## Boundaries

- Keep the existing intercepted `/edit` route, shareable URL, browser back behavior, provider order, form fields, transaction mutations, and API contracts.
- Do not add a global modal provider, change database code, introduce dependencies, or edit the lockfile.
- Do not alter the category dropdown behavior or add `animation-fill-mode` to `.animate-modal`.
- Do not stage or commit `graphify-out/`.

## Acceptance Checks

1. Clicking the mobile navigation button labeled `新增帳目` opens the modal titled `新增帳目`.
2. A number-key button is usable immediately after the modal appears and updates the amount display.
3. Closing the modal returns to the previous route.
4. The `/edit` links explicitly request full prefetching.
5. The new-record modal no longer depends on a post-mount `open` effect.
6. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` from `my-app/`.
7. Exercise the add-modal flow in a running app with Playwright and confirm there are no browser console errors caused by the change.

## Regression Checks

- Editing an existing transaction still waits for context records and uses the matched record when available.
- Closing continues to use `router.back()`.
- Favorite categories remain supplied by `FavoriteCategoriesProvider` and synchronized by `PrepareData`.
- The modal animation retains no fill mode, preserving fixed-position dropdown coordinates.

## Environment

- App commands run from `my-app/` as required by `AGENTS.md`.
- Browser verification uses Python Playwright and the repository development server.
- Next.js route prefetching is production-only; the production build is required even though interaction is exercised against the development server.
- The implementation is intentionally performed on `main` and pushed to `origin/main` per explicit user instruction.

## Ownership and Handoff

- Codex owns the implementation, verification, commit, and push.
- No dependency, database, API, or design handoff is required.
