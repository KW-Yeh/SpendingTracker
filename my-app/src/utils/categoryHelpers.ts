// Map emoji categories to DB column names
export const CATEGORY_EMOJI_TO_DB_MAP: Record<string, CategoryKey> = {
  '🍔': 'food',
  '👗': 'clothing',
  '🏠': 'housing',
  '🚗': 'transportation',
  '📚': 'education',
  '🎲': 'entertainment',
  '🧻': 'daily',
  '💊': 'medical',
  '📉': 'investment',
  '📈': 'investment',
  '💰': 'salary',
  '🎁': 'bonus',
  '✨': 'other',
};

/**
 * Helper: 取得特定類別的常用描述陣列
 */
export function getCategoryFavorites(
  favorites: FavoriteCategories | null,
  categoryEmoji: string,
): string[] {
  if (!favorites) return [];

  const dbColumn = CATEGORY_EMOJI_TO_DB_MAP[categoryEmoji];
  if (!dbColumn) return [];

  const value = favorites[dbColumn];
  if (!value || value.trim() === '') return [];

  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '');
}

/**
 * Helper: 更新特定類別的常用描述
 */
export function updateCategoryFavorites(
  favorites: FavoriteCategories | null,
  categoryEmoji: string,
  descriptions: string[],
): Partial<FavoriteCategories> {
  const dbColumn = CATEGORY_EMOJI_TO_DB_MAP[categoryEmoji];
  if (!dbColumn) {
    throw new Error('無效的類別');
  }

  return {
    ...favorites,
    [dbColumn]: descriptions.join(','),
  };
}
