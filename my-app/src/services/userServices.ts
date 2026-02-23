const URL = '/api/aurora/user';

export const getUser = async (
  id: string,
): Promise<{
  status: boolean;
  data: User | null;
  message: string;
}> => {
  try {
    if (!id) return { status: false, data: null, message: '缺少 ID 資訊' };
    // console.log('[Client getUser] Fetching user with email:', id);
    const data = await fetch(`${URL}?id=${id}`).then((res) => res.json());
    // console.log('[Client getUser] Response data:', data);
    const isUser = data && typeof data === 'object' && 'user_id' in data;
    return { status: true, data: isUser ? (data as User) : null, message: 'success' };
  } catch (error) {
    console.error('[Client getUser] Error:', error);
    return { status: false, data: null, message: '發生不預期的錯誤' };
  }
};

export const putUser = async (data: User) => {
  try {
    await fetch(URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return { status: true, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, message: '發生不預期的錯誤' };
  }
};

export const createUser = async (data: User) => {
  try {
    console.log('[Client createUser] Creating user with data:', data);
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || result?.message === 'Internal Server Error') {
      console.error('[Client createUser] Server error:', result?.message);
      return { status: false, message: result?.message || '建立失敗' };
    }
    return { status: true, message: 'success' };
  } catch (error) {
    console.error('[Client createUser] Error:', error);
    return { status: false, message: '發生不預期的錯誤' };
  }
};