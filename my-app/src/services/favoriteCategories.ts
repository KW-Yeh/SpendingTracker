import { getDb } from '@/utils/getAurora';
import { CATEGORY_EMOJI_TO_DB_MAP } from '@/utils/categoryHelpers';

/**
 * 查詢常用類別
 */
export async function getFavoriteCategories(
  ownerId: number,
): Promise<FavoriteCategories | null> {
  if (!ownerId) {
    throw new Error('缺少使用者 ID');
  }

  const db = await getDb();

  const query = `
    SELECT
      category_id,
      owner_id,
      food, clothing, housing, transportation,
      education, entertainment, daily, medical,
      investment, other, salary, bonus,
      created_at, updated_at
    FROM favorite_categories
    WHERE owner_id = $1
  `;

  const result = await db.query(query, [ownerId]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * 建立或更新常用類別 (UPSERT)
 */
export async function putFavoriteCategories(data: {
  category_id?: number;
  owner_id: number;
  food?: string;
  clothing?: string;
  housing?: string;
  transportation?: string;
  education?: string;
  entertainment?: string;
  daily?: string;
  medical?: string;
  investment?: string;
  other?: string;
  salary?: string;
  bonus?: string;
}): Promise<FavoriteCategories> {
  const { category_id, owner_id, ...categories } = data;

  if (!owner_id) {
    throw new Error('缺少使用者 ID');
  }

  const db = await getDb();

  const categoryId = category_id || Date.now();

  const query = `
    INSERT INTO favorite_categories (
      category_id, owner_id,
      food, clothing, housing, transportation,
      education, entertainment, daily, medical,
      investment, other, salary, bonus,
      created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
    ON CONFLICT (owner_id)
    DO UPDATE SET
      food = EXCLUDED.food,
      clothing = EXCLUDED.clothing,
      housing = EXCLUDED.housing,
      transportation = EXCLUDED.transportation,
      education = EXCLUDED.education,
      entertainment = EXCLUDED.entertainment,
      daily = EXCLUDED.daily,
      medical = EXCLUDED.medical,
      investment = EXCLUDED.investment,
      other = EXCLUDED.other,
      salary = EXCLUDED.salary,
      bonus = EXCLUDED.bonus,
      updated_at = NOW()
    RETURNING category_id, owner_id, food, clothing, housing, transportation,
              education, entertainment, daily, medical, investment, other,
              salary, bonus, created_at, updated_at
  `;

  const result = await db.query(query, [
    categoryId,
    owner_id,
    categories.food || '',
    categories.clothing || '',
    categories.housing || '',
    categories.transportation || '',
    categories.education || '',
    categories.entertainment || '',
    categories.daily || '',
    categories.medical || '',
    categories.investment || '',
    categories.other || '',
    categories.salary || '',
    categories.bonus || '',
  ]);

  return result.rows[0];
}
