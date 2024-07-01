// https://stackoverflow.com/a/47160545
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

export const resetHours = (date: Date) => date.setHours(0, 0, 0, 0);
