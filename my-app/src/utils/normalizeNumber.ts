"use client";
export const normalizeNumber = (num: number) => {
  // Round to integer (ignore decimal part)
  const integerPart = Math.floor(num).toString();

  // Format integer part with commas
  const res: string[] = [];
  const digitList = integerPart.split("").reverse();
  let count = 0;
  digitList.forEach((digit) => {
    if (count !== 0 && count % 3 === 0) {
      res.push(",");
    }
    res.push(digit);
    count++;
  });

  return res.toReversed().join("");
};
