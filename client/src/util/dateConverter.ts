export const toDateString = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString();
};
