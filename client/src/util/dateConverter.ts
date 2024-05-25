import { Interval } from "../types";

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

/**
 * 
 * @param interval Date strings
 * @returns {
 *  startDate: interval start with hour|min|sec|mm set to 0,
 *  endDate: interval end incremented with hour|min|sec|mm set to 0
 * }
 */
export const parseDateInterval = (interval: Interval<string>) => {
  const { start, end } = interval;

  const startDate = start ? new Date(start) : undefined;
  if (startDate) {
    startDate.setHours(0, 0, 0, 0);
  }

  const endDate = end ? new Date(end) : undefined;
  if (endDate) {
    endDate.setHours(0, 0, 0, 0);
    endDate.setDate(endDate.getDate() + 1);
  }

  return { startDate, endDate };
};
