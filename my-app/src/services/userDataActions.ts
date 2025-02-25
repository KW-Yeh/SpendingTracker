'use server';

const URL = `${process.env.AWS_API_GATEWAY_URL}/user`;

export const getUser = async (
  id: string,
): Promise<{
  status: boolean;
  data: User | null;
  message: string;
}> => {
  try {
    if (!id) return { status: false, data: null, message: '缺少 ID 資訊' };
    const data: User = await fetch(`${URL}/${id}`).then((res) => res.json());
    return { status: true, data, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, data: null, message: '發生不預期的錯誤' };
  }
};

export const putUser = async (data: User) => {
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
