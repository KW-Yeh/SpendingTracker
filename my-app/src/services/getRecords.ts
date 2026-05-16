const URL = '/api/aurora/items';

export const getItems = async (
  groupId?: string,
  email?: string,
  startDate?: string,
  endDate?: string,
): Promise<{
  status: boolean;
  data: SpendingRecord[];
  message: string;
}> => {
  try {
    const query = new URLSearchParams();
    if (groupId) {
      query.set('groupId', groupId);
    } else if (email) {
      query.set('email', email);
    } else {
      return { status: false, data: [], message: '缺少群組 ID 或信箱資訊' };
    }
    if (startDate) query.set('startDate', startDate);
    if (endDate) query.set('endDate', endDate);
    const data = await fetch(`${URL}?${query}`).then((res) => res.json());
    return { status: true, data, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, data: [], message: '發生不預期的錯誤' };
  }
};

export const putItem = async (
  data: SpendingRecord,
): Promise<{ status: boolean; message: string }> => {
  try {
    const res = await fetch(URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { status: false, message: '發生不預期的錯誤' };
  }
};

export const deleteItem = async (
  id: string,
): Promise<{ status: boolean; message: string }> => {
  try {
    const res = await fetch(`${URL}?id=${id}`, { method: 'DELETE' });
    return res.json();
  } catch (error) {
    console.error(error);
    return { status: false, message: '發生不預期的錯誤' };
  }
};
