'use server';

const URL = `${process.env.AWS_API_GATEWAY_URL}/items`;

export const getItems = async (
  groupId?: string,
  email?: string,
  time?: string,
) => {
  try {
    let apiUrl = URL;
    if (groupId) {
      apiUrl = `${URL}/id/${groupId}${time ? `?time=${time}` : ''}`;
    } else if (email) {
      apiUrl = `${URL}/user/${email}${time ? `?time=${time}` : ''}`;
    } else {
      return { status: false, data: [], message: '缺少群組 ID 或信箱資訊' };
    }
    const data = await fetch(apiUrl).then((res) => res.json());
    return { status: true, data, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, data: [], message: '發生不預期的錯誤' };
  }
};

export const putItem = async (data: SpendingRecord) => {
  try {
    await fetch(`${URL}`, {
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

export const deleteItem = async (id: string) => {
  try {
    await fetch(`${URL}/id/${id}`, { method: 'DELETE' });
    return { status: true, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, message: '發生不預期的錯誤' };
  }
};
