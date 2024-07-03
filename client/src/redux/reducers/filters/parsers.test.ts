import { describe, expect, test } from "@jest/globals";
import { RootState } from "../../store";
import { Filter } from "./filterSlice";
import { createFilterState } from "../../../../test/creators";
import { selectParsedFilters } from "./parsers";

const createParsingFilterRootState = (
  filters?: Partial<Filter>
): RootState => (
  { filters: createFilterState({ filters }) } as RootState
);

describe("Filter Slice parsers", () => {
  describe("selectParsedFilters", () => {
    describe("published", () => {
      test("should parse empty string as undefined", () => {
        const published = { start: "", end: "" };
        const parsedPublished = { start: undefined, end: undefined };

        const state = createParsingFilterRootState({ published });

        const result = selectParsedFilters(state);
        expect(result.published).toStrictEqual(parsedPublished);
      });

      test("should parse number strings as numbers", () => {
        const published = { start: "1990", end: "2024" };
        const parsedPublished = { start: 1990, end: 2024 };

        const state = createParsingFilterRootState({ published });

        const result = selectParsedFilters(state);
        expect(result.published).toStrictEqual(parsedPublished);
      });
    });

    describe("addDate", () => {
      test("should parse empty string as undefined", () => {
        const addDate = { start: "", end: "" };
        const parsedAddDate = { start: undefined, end: undefined };

        const state = createParsingFilterRootState({ addDate });

        const result = selectParsedFilters(state);
        expect(result.addDate).toStrictEqual(parsedAddDate);
      });

      describe("addDate start", () => {
        test("should convert to local date", () => {
          const addDate = { start: "2024-07-03", end: "" };
          const state = createParsingFilterRootState({ addDate });

          const result = selectParsedFilters(state);
          const resultParsedStart = result.addDate.start;

          expect(resultParsedStart).toBeInstanceOf(Date);

          expect(resultParsedStart?.getFullYear()).toEqual(2024);
          expect(resultParsedStart?.getMonth()).toEqual(7 - 1); // zero based
          expect(resultParsedStart?.getDate()).toEqual(3);
        });

        test("should set hours to local zero", () => {
          const addDate = { start: "2024-07-03", end: "" };
          const state = createParsingFilterRootState({ addDate });

          const result = selectParsedFilters(state);
          const resultParsedStart = result.addDate.start;

          expect(resultParsedStart?.getHours()).toEqual(0);
          expect(resultParsedStart?.getMinutes()).toEqual(0);
          expect(resultParsedStart?.getSeconds()).toEqual(0);
          expect(resultParsedStart?.getMilliseconds()).toEqual(0);
        });
      });

      describe("addDate end", () => {
        test("should convert to following local date", () => {
          const addDate = { start: "", end: "2024-07-03" };
          const state = createParsingFilterRootState({ addDate });

          const result = selectParsedFilters(state);
          const resultParsedEnd = result.addDate.end;

          expect(resultParsedEnd).toBeInstanceOf(Date);

          expect(resultParsedEnd?.getFullYear()).toEqual(2024);
          expect(resultParsedEnd?.getMonth()).toEqual(7 - 1); // zero based
          expect(resultParsedEnd?.getDate()).toEqual(3 + 1); // the next day
        });

        test("should set hours to local zero", () => {
          const addDate = { start: "", end: "2024-07-03" };
          const state = createParsingFilterRootState({ addDate });

          const result = selectParsedFilters(state);
          const resultParsedEnd = result.addDate.end;

          expect(resultParsedEnd?.getHours()).toEqual(0);
          expect(resultParsedEnd?.getMinutes()).toEqual(0);
          expect(resultParsedEnd?.getSeconds()).toEqual(0);
          expect(resultParsedEnd?.getMilliseconds()).toEqual(0);
        });
      });
    });

    test("should not compute again with the same state", () => {
      const state = createParsingFilterRootState();

      selectParsedFilters.resetRecomputations();
      selectParsedFilters(state);
      expect(selectParsedFilters.recomputations()).toBe(1);
      selectParsedFilters(state);
      expect(selectParsedFilters.recomputations()).toBe(1);
    });

    test("should recompute with a new state", () => {
      const firstState = createParsingFilterRootState();

      selectParsedFilters.resetRecomputations();
      selectParsedFilters(firstState);
      expect(selectParsedFilters.recomputations()).toBe(1);

      const secondState = createParsingFilterRootState(
        { published: { start: "1990", end: "1991" } },
      );

      selectParsedFilters(secondState);
      expect(selectParsedFilters.recomputations()).toBe(2);
    });
  });
});