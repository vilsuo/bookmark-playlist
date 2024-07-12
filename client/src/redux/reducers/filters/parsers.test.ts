import { describe, expect, test } from "@jest/globals";
import { selectParsedFilters } from "./parsers";
import { createDefaultFiltersRootState } from "../../../../test/state";
import { Filter } from "./filterSlice";
import { createDateISOString } from "../../../util/dateConverter";

const createFiltersTestRootState = (filters?: Partial<Filter>) => 
  createDefaultFiltersRootState({ filters });

describe("Filter Slice parsers", () => {
  describe("selectParsedFilters", () => {
    describe("published", () => {
      test("should parse empty string as undefined", () => {
        const published = { start: "", end: "" };
        const parsedPublished = { start: undefined, end: undefined };

        const state = createFiltersTestRootState({ published });

        const result = selectParsedFilters(state);
        expect(result.published).toStrictEqual(parsedPublished);
      });

      test("should parse number strings as numbers", () => {
        const published = { start: "1990", end: "2024" };
        const parsedPublished = { start: 1990, end: 2024 };

        const state = createFiltersTestRootState({ published });

        const result = selectParsedFilters(state);
        expect(result.published).toStrictEqual(parsedPublished);
      });
    });

    describe("addDate", () => {
      const year = 2024;
      const month = 7;
      const day = 3;
      const dateString = createDateISOString(year, month, day);

      test("should parse empty string as undefined", () => {
        const addDate = { start: "", end: "" };
        const parsedAddDate = { start: undefined, end: undefined };

        const state = createFiltersTestRootState({ addDate });

        const result = selectParsedFilters(state);
        expect(result.addDate).toStrictEqual(parsedAddDate);
      });

      describe("addDate start", () => {
        test("should convert to local date", () => {
          const addDate = { start: dateString, end: "" };
          const state = createFiltersTestRootState({ addDate });

          const result = selectParsedFilters(state);
          const resultParsedStart = new Date(result.addDate.start!);

          expect(resultParsedStart?.getFullYear()).toBe(year);
          expect(resultParsedStart?.getMonth()).toBe(month - 1); // zero based
          expect(resultParsedStart?.getDate()).toBe(day);
        });

        test("should set hours to local zero", () => {
          const addDate = { start: dateString, end: "" };
          const state = createFiltersTestRootState({ addDate });

          const result = selectParsedFilters(state);
          const resultParsedStart = new Date(result.addDate.start!);

          expect(resultParsedStart?.getHours()).toEqual(0);
          expect(resultParsedStart?.getMinutes()).toEqual(0);
          expect(resultParsedStart?.getSeconds()).toEqual(0);
          expect(resultParsedStart?.getMilliseconds()).toEqual(0);
        });
      });

      describe("addDate end", () => {
        test("should convert to following local date", () => {
          const addDate = { start: "", end: dateString };
          const state = createFiltersTestRootState({ addDate });

          const result = selectParsedFilters(state);
          const resultParsedEnd = new Date(result.addDate.end!);

          expect(resultParsedEnd?.getFullYear()).toEqual(year);
          expect(resultParsedEnd?.getMonth()).toEqual(month - 1); // zero based
          expect(resultParsedEnd?.getDate()).toEqual(day + 1); // the next day
        });

        test("should set hours to local zero", () => {
          const addDate = { start: "", end: dateString };
          const state = createFiltersTestRootState({ addDate });

          const result = selectParsedFilters(state);
          const resultParsedEnd = new Date(result.addDate.end!);

          expect(resultParsedEnd?.getHours()).toEqual(0);
          expect(resultParsedEnd?.getMinutes()).toEqual(0);
          expect(resultParsedEnd?.getSeconds()).toEqual(0);
          expect(resultParsedEnd?.getMilliseconds()).toEqual(0);
        });
      });
    });

    describe("recomputations", () => {
      test("should not compute again with the same state", () => {
        const state = createFiltersTestRootState();

        selectParsedFilters.resetRecomputations();

        selectParsedFilters(state);
        expect(selectParsedFilters.recomputations()).toBe(1);

        selectParsedFilters(state);
        expect(selectParsedFilters.recomputations()).toBe(1);
      });

      test("should recompute with a new state", () => {
        const firstState = createFiltersTestRootState();
        const secondState = createFiltersTestRootState(
          { published: { start: "1990", end: "1991" } },
        );

        selectParsedFilters.resetRecomputations();

        selectParsedFilters(firstState);
        expect(selectParsedFilters.recomputations()).toBe(1);

        selectParsedFilters(secondState);
        expect(selectParsedFilters.recomputations()).toBe(2);
      });
    });
  });
});
