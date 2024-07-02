// https://stackoverflow.com/a/47160545
// undefined as the first argument: it will detect the browser language
const formatter = new Intl.DateTimeFormat(
  undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
);

export const toDateString = (value: string) => {
  // const date = new Date(value);
  // return date.toLocaleDateString();

  const date = new Date(value);
  return formatter.format(date);

  // return album.addDate.split('T')[0].replace(/-/g, '/');
};

///**
// * Convert date for <input type="date" /> format (YYYY-MM-DD)
// * 
// * @param date 
// * @returns date in YYYY-MM-DD format
// */
//export const toDateInputString = (date: Date) => {
//  const month = ("0" + (date.getMonth() + 1)).slice(-2);
//  const day = ("0" + date.getDate()).slice(-2);
//  const year = date.getFullYear();
//
//  return `${year}-${month}-${day}`;
//};

