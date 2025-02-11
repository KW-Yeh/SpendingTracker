/** Item **/

export const putItem = async (data: SpendingRecord) => {
  return fetch('/api/aws/items', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteItem = async (id: string) => {
  return fetch(`/api/aws/items?id=${id}`, {
    method: 'DELETE',
  });
};

export const getItems = async (groupId?: string, email?: string, time?: string) => {
  if (groupId) {
    return fetch(`/api/aws/items?groupId=${groupId}${time ? `?time=${time}`: ''}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then(res => {
        if (res.message === "Internal Server Error") {
          throw new Error("Internal Server Error")
        }
        return res;
      })
      .then((res) => res as SpendingRecord[]);
  }
  if (email) {
    return fetch(`/api/aws/items?email=${email}${time ? `?time=${time}`: ''}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then(res => {
        if (res.message === "Internal Server Error") {
          throw new Error("Internal Server Error")
        }
        return res;
      })
      .then((res) => res as SpendingRecord[]);
  }
  return Promise.reject('缺少群組 ID 或信箱資訊');
};

/** Item **/
/** ========================================= **/
/** Group **/

export const putGroup = async (data: Group) => {
  return fetch(`/api/aws/groups`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteGroup = async (id: string) => {
  return fetch(`/api/aws/groups?id=${id}`, {
    method: 'DELETE',
  });
};

export const getGroups = async (groupId: string | string[]) => {
  const groupList = Array.isArray(groupId) ? groupId : [groupId];
  return fetch(`/api/aws/groups?ids=${JSON.stringify(groupList)}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res) => res as Group[]);
};

/** Group **/
/** ========================================= **/
/** User **/

export const getUser = async (id: string) => {
  return fetch(`/api/aws/user?id=${id}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res) => res as User);
};

export const putUser = async (data: User) => {
  return fetch(`/api/aws/user`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/** User **/
