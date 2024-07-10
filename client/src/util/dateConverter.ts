// https://stackoverflow.com/a/47160545
// undefined as the first argument: it will detect the browser language
const formatter = new Intl.DateTimeFormat(
  undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
);

export const toLocaleDateString = (value: string) => {
  const date = new Date(value);
  return formatter.format(date);
};

/**
 * Create date string in form YYYY-MM-DD
 * 
 * @param year the year, with four digits (0000 to 9999)
 * @param month the month, with two digits (01 to 12). Defaults to 1
 * @param date the day of the month, with two digits (01 to 31). Defaults to 1
 * @returns 
 */
export const createDateISOString = (year: number, month: number = 1, date: number = 1) => {
  const YYYY = `0000${year}`.slice(-4);
  const MM = `00${month}`.slice(-2);
  const DD = `00${date}`.slice(-2);
  return `${YYYY}-${MM}-${DD}`;
};
