export const getStartEndOfMonth = (theDay: string | Date) => {
  const startDate = new Date(
    new Date(theDay).getFullYear(),
    new Date(theDay).getMonth(),
    1,
    0,
    0,
    0,
  );
  const endDate = new Date(
    new Date(theDay).getFullYear(),
    new Date(theDay).getMonth() + 1,
    0,
    23,
    59,
    59,
  );
  return { startDate, endDate };
};
