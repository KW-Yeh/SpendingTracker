export const putItem = async (data: SpendingRecord) => {
  return fetch(`/api/aws`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteItem = async (id: string) => {
  return fetch(`/api/aws?id=${id}`, {
    method: 'DELETE',
  });
};

export const getItem = async (id: string) => {
  return fetch(`/api/aws?id=${id}`, {
    method: 'GET',
  });
};

export const getItems = async () => {
  return fetch('/api/aws', {
    method: 'GET',
  });
};
