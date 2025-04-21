type Formation = 'MM/dd' | 'yyyy/MM/dd/';

export const formatDate = (
  date: string | Date,
  formation: Formation = 'MM/dd',
) => {
  const _date = new Date(date);
  const year = _date.getFullYear();
  const month = (_date.getMonth() + 1).toString().padStart(2, '0');
  const day = _date.getDate().toString().padStart(2, '0');
  if (formation === 'MM/dd') {
    return `${month}/${day}`;
  } else if (formation === 'yyyy/MM/dd/') {
    return `${year}/${month}/${day}`;
  }
  return _date.toLocaleDateString();
};
