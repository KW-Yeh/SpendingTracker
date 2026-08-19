/**
 * `?mock=1` on any route swaps the context providers over to the fixtures in
 * `mockData.ts`, so every page can be reviewed without a reachable database.
 *
 * Read it through `useMockMode()` in components — this bare helper is for the
 * few places that need the value outside React state (e.g. the login guard).
 */
export const MOCK_PARAM = 'mock';

export const isMockRequest = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get(MOCK_PARAM) === '1';
