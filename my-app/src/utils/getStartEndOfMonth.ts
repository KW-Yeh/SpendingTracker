export const getStartEndOfMonth = (theDay: string | Date) => {
  const startDate = new Date(
    new Date(theDay).getFullYear(),
    new Date(theDay).getMonth(),
    1,
    0,
    0,
    0,
  );
  const days = new Date(
    new Date(theDay).getFullYear(),
    new Date(theDay).getMonth(),
    0,
  ).getDate();
  const endDate = new Date(
    new Date(theDay).getFullYear(),
    new Date(theDay).getMonth(),
    days,
    23,
    59,
    59,
  );
  return { startDate, endDate };
};
