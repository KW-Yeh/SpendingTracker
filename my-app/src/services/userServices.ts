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
    console.log('[Client getUser] Fetching user with email:', id);
    const data: User | null = await fetch(`${URL}?id=${id}`).then((res) => res.json());
    console.log('[Client getUser] Response data:', data);
    return { status: true, data, message: 'success' };
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
    console.log('[Client createUser] Server response:', result);
    return { status: true, message: 'success' };
  } catch (error) {
    console.error('[Client createUser] Error:', error);
    return { status: false, message: '發生不預期的錯誤' };
  }
};