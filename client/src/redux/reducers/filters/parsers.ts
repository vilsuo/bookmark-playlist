import { createSelector } from "@reduxjs/toolkit";
import { Interval } from "../../../types";
import { Filter, FilterInterval, selectFilters } from "./filterSlice";

export type ParsedFilterInterval = Interval<number | undefined>;

export type ParsedFilter = Omit<Filter, "published" | "addDate"> & {
  published: ParsedFilterInterval;
  addDate: ParsedFilterInterval;
};

/**
 * Create a memoized selector for converting filters to a form that allows 
 * albums to be filtered
 */
export const selectParsedFilters = createSelector(
  [selectFilters],
  (filters): ParsedFilter => ({
    ...filters,
    published: parsePublishedFilterInterval(filters.published),
    addDate: parseAddDateFilterInterval(filters.addDate),
  }),
);

/**
 * Convert string interval to number interval to be used in filtering
 * 
 * @remarks empty string is converter to undefined
 * 
 * @param interval number strings
 * @returns start: interval start published, end: interval end published
 */
const parsePublishedFilterInterval = ({ start, end }: FilterInterval)
: ParsedFilterInterval => {
  const startPublish = start ? Number(start) : undefined;
  const endPublish = end ? Number(end) : undefined;

  return { start: startPublish, end: endPublish };
};

/**
 * Convert date string interval to local time interval be used in filtering
 * 
 * @remarks
 * * empty strings are converter to undefined
 * * time is set to 00:00:00.000 of the current timezone for each date
 * * end date is incremented by one
 * 
 * @param start interval start date string in format YYYY-MM-DD
 * @param end interval end date string in format YYYY-MM-DD
 * 
 * @returns date interval values converted to milliseconds since midnight,
 *          January 1, 1970 UTC
 */
const parseAddDateFilterInterval = (
  { start, end }: FilterInterval,
) : ParsedFilterInterval => {
  let startTime;
  let endTime;

  if (start) {
    const [yyyy, mm, dd] = start.split("-");
    // local time midnight
    startTime = new Date(Number(yyyy), Number(mm) - 1, Number(dd)).getTime();
  }

  if (end) {
    const [yyyy, mm, dd] = end.split("-");
    // local time next day midnight
    endTime = new Date(Number(yyyy), Number(mm) - 1, Number(dd) + 1).getTime();
  }

  return { start: startTime, end: endTime };
};
