/** Item **/

export const putItem = async (data: SpendingRecord) => {
  return fetch(`/api/aws/items`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteItem = async (id: string) => {
  return fetch(`/api/aws/items?id=${id}`, {
    method: 'DELETE',
  });
};

export const getItems = async (groupId?: string, email?: string) => {
  const queryStringList: string[] = [];
  if (groupId) {
    queryStringList.push(`id=${groupId}`);
  }
  if (email) {
    queryStringList.push(`email=${email}`);
  }
  return fetch(
    `/api/aws/items${queryStringList.length > 0 ? `?${queryStringList.join('&')}` : ''}`,
    {
      method: 'GET',
    },
  )
    .then((res) => res.json())
    .then((res) => res as SpendingRecord[]);
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
