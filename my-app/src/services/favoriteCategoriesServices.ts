const URL = '/api/aurora/favorite-categories';

export const getFavoriteCategories = async (
  ownerId: number,
): Promise<{
  status: boolean;
  data: FavoriteCategories | null;
  message: string;
}> => {
  try {
    if (!ownerId) {
      return { status: false, data: null, message: '缺少使用者 ID' };
    }

    const data = await fetch(`${URL}?owner_id=${ownerId}`).then((res) =>
      res.json(),
    );

    return { status: true, data, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, data: null, message: '發生不預期的錯誤' };
  }
};

export const putFavoriteCategories = async (
  data: Partial<FavoriteCategories> & { owner_id: number },
): Promise<{
  status: boolean;
  data?: FavoriteCategories;
  message: string;
}> => {
  try {
    const result = await fetch(URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    return { status: true, data: result, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, message: '發生不預期的錯誤' };
  }
};
