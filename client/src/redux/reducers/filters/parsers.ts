import { createSelector } from "@reduxjs/toolkit";
import { Interval } from "../../../types";
import { Filter, FilterInterval, selectFilters } from "./filterSlice";

export type ParsedPublishedFilterInterval = Interval<number | undefined>;

export type ParsedAddDateFilterInterval = Interval<Date | undefined>;

export type ParsedFilter = Omit<Filter, "published" | "addDate"> & {
  published: ParsedPublishedFilterInterval;
  addDate: ParsedAddDateFilterInterval;
};

/**
 * Create a memoized selector for converting filters to a form that allows 
 * albums to be filtered
 */
export const selectParsedFilters = createSelector(
  selectFilters,
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
: ParsedPublishedFilterInterval => {
  const startPublish = start ? Number(start) : undefined;
  const endPublish = end ? Number(end) : undefined;

  return { start: startPublish, end: endPublish };
};

/**
 * Convert string date interval to date interval to be used in filtering
 * 
 * @remarks empty string is converter to undefined
 * 
 * @param interval Date strings
 * @returns start: interval start date with hour|min|sec|mm set to 0,
 * end: the next date of interval end date with hour|min|sec|mm set to 0
 */
const parseAddDateFilterInterval = ({ start, end }: FilterInterval)
: ParsedAddDateFilterInterval => {
  const startDate = start ? new Date(start) : undefined;
  if (startDate) {
    startDate.setHours(0, 0, 0, 0);
  }

  const endDate = end ? new Date(end) : undefined;
  if (endDate) {
    endDate.setHours(0, 0, 0, 0);
    endDate.setDate(endDate.getDate() + 1);
  }

  return { start: startDate, end: endDate };
};
