const URL = `${process.env.AWS_API_GATEWAY_URL}/groups`;

export const putGroup = async (data: Group) => {
  try {
    await fetch('/api/aws/groups', {
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
    await fetch(`/api/aws/groups?id=${id}`, {
      method: 'DELETE',
    });
    return { status: true, message: 'success' };
  } catch (error) {
    console.error(error);
    return { status: false, data: [], message: '發生不預期的錯誤' };
  }
};

export const getGroups = async (
  groupId: string | string[],
): Promise<{
  status: boolean;
  data: Group[];
  message: string;
}> => {
  try {
    if (!Array.isArray(groupId)) {
      const data = await fetch(`/api/aws/groups?id=${groupId}`).then((res) =>
        res.json(),
      );
      return { status: true, data, message: 'success' };
    } else {
      const data = await fetch(
        `/api/aws/groups?ids=${JSON.stringify(groupId)}`,
      ).then((res) => res.json());
      return {
        status: true,
        data,
        message: 'success',
      };
    }
  } catch (error) {
    console.error(error);
    return { status: false, data: [], message: '發生不預期的錯誤' };
  }
};
