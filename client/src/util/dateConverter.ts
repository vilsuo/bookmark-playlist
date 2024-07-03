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
