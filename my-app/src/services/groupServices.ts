const URL = '/api/aurora/groups';

export const createGroup = async (data: Group) => {
  try {
    await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return { status: true, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, data: [], message: '發生不預期的錯誤' };
  }
};

export const putGroup = async (data: Group) => {
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
    return { status: false, data: [], message: '發生不預期的錯誤' };
  }
};

export const deleteGroup = async (id: string) => {
  try {
    await fetch(`${URL}?id=${id}`, {
      method: 'DELETE',
    });
    return { status: true, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, data: [], message: '發生不預期的錯誤' };
  }
};

export const getGroups = async (
  user_id: number,
): Promise<{
  status: boolean;
  data: Group[];
  message: string;
}> => {
  try {
    const data = await fetch(`${URL}?id=${user_id}`).then((res) => res.json());
    return { status: true, data, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, data: [], message: '發生不預期的錯誤' };
  }
};

export const removeGroupMember = async (
  accountId: number,
  userId: number,
): Promise<{
  status: boolean;
  message: string;
}> => {
  try {
    await fetch(
      `/api/aurora/group/member?account_id=${accountId}&user_id=${userId}`,
      {
        method: 'DELETE',
      },
    );
    return { status: true, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, message: '發生不預期的錯誤' };
  }
};

export const getGroupMembers = async (
  accountId: number,
): Promise<{
  status: boolean;
  data: GroupMember[];
  message: string;
}> => {
  try {
    if (!accountId) {
      return { status: false, data: [], message: '缺少帳本 ID' };
    }
    const data = await fetch(`/api/aurora/group/members?account_id=${accountId}`).then(
      (res) => res.json(),
    );
    return { status: true, data, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, data: [], message: '發生不預期的錯誤' };
  }
};
