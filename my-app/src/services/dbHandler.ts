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

export const getItems = async () => {
  return fetch('/api/aws/items', {
    method: 'GET',
  });
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

export const getGroups = async () => {
  return fetch('/api/aws/groups', {
    method: 'GET',
  });
};

/** Group **/
/** ========================================= **/
/** User **/

export const getUser = async (id: string) => {
  return fetch(`/api/aws/user?id=${id}`, {
    method: 'GET',
  });
};

export const putUser = async (data: User) => {
  return fetch(`/api/aws/user`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/** User **/
