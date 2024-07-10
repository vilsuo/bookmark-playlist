import { describe, expect, test } from "@jest/globals";
import { renderWithProviders } from "../../../../../../test/testUtils";
import FilterColumn from "./FilterColumn";
import { createFiltersRootState } from "../../../../../../test/creators";
import { changeOptionByLabel, findInputByLabelMatcher } from "../../../../../../test/uiHelpers";
import { AlbumColumn } from "../../../../../types";
import { fireEvent, screen } from "@testing-library/dom";
import { initialState as defaultFiltersState, selectFilters } from "../../../../../redux/reducers/filters/filterSlice";

const columnMatcher = /By/i;

const textFilterMatcher = /Search/i;

const startMatcher = /From/i;
const endMatcher = /To/i;

const changeColumnOption = async (column: AlbumColumn) => {
  await changeOptionByLabel(columnMatcher, column);
};

const findColumnOption = async () => findInputByLabelMatcher(columnMatcher);

const findStartInput = async () => findInputByLabelMatcher(startMatcher);
const findEndInput = async () => findInputByLabelMatcher(endMatcher);

const changeStartInput = async (value: string) => changeOptionByLabel(startMatcher, value);
const changeEndInput = async (value: string) => changeOptionByLabel(endMatcher, value);

const resetFilter = async () => fireEvent.click(screen.getByRole("button"), { name: /Clear/i });

describe("<FilterColumn />", () => {
  describe("filter columns", () => {
    const text = "sample text";
    const published = { start: "1990", end: "2000" };
    const addDate = { start: "1990-04-07", end: "2000-12-31" };

    test("should be able to change filter column", async () => {
      const preloadedState = createFiltersRootState({ filters: { text, published, addDate } });
      renderWithProviders(<FilterColumn />, { preloadedState });

      // artist
      await changeColumnOption(AlbumColumn.ARTIST);
      expect(await findColumnOption()).toHaveValue(AlbumColumn.ARTIST);
      expect(await findInputByLabelMatcher(textFilterMatcher))
        .toHaveValue(text);

      // album
      await changeColumnOption(AlbumColumn.ALBUM);
      expect(await findColumnOption()).toHaveValue(AlbumColumn.ALBUM);
      expect(await findInputByLabelMatcher(textFilterMatcher))
        .toHaveValue(text);

      // published
      await changeColumnOption(AlbumColumn.PUBLISHED);
      expect(await findColumnOption()).toHaveValue(AlbumColumn.PUBLISHED);
      expect(await findStartInput()).toHaveDisplayValue(published.start);
      expect(await findEndInput()).toHaveDisplayValue(published.end);

      // addDate
      await changeColumnOption(AlbumColumn.ADD_DATE);
      expect(await findColumnOption()).toHaveValue(AlbumColumn.ADD_DATE);

      expect(await findStartInput()).toHaveDisplayValue(addDate.start);
      expect(await findEndInput()).toHaveDisplayValue(addDate.end);
    });

    describe.each([
      AlbumColumn.ARTIST,
      AlbumColumn.ALBUM
    ])("%s", (column) => {
      const preloadedState = createFiltersRootState({ filters: { column, text, published, addDate } });

      test("should render published filter", async () => {
        renderWithProviders(<FilterColumn />, { preloadedState });

        expect(await findColumnOption()).toHaveValue(column);
        expect(await findInputByLabelMatcher(textFilterMatcher))
          .toHaveValue(text);
      });

      test("should clear only text filter when resetting", async () => {
        const { store } = renderWithProviders(<FilterColumn />, { preloadedState });

        await resetFilter();

        const defaultText = defaultFiltersState.filters.text;
        expect(await findInputByLabelMatcher(textFilterMatcher))
          .toHaveValue(defaultText);

        expect(selectFilters(store.getState())).toStrictEqual({
          ...selectFilters(preloadedState),
          text: defaultText,
        });
      });
    });

    describe(AlbumColumn.PUBLISHED, () => {
      const column = AlbumColumn.PUBLISHED;
      const preloadedState = createFiltersRootState({ filters: { column, text, published, addDate } });

      test("should render published filter", async () => {
        renderWithProviders(<FilterColumn />, { preloadedState });

        expect(await findColumnOption()).toHaveValue(column);
        expect(await findStartInput()).toHaveDisplayValue(published.start);
        expect(await findEndInput()).toHaveDisplayValue(published.end);
      });

      test("should be able to change start filter", async () => {
        const newStart = "1995";
        const { store } = renderWithProviders(<FilterColumn />, { preloadedState });

        await changeStartInput(newStart);

        expect(await findStartInput()).toHaveDisplayValue(newStart);

        expect(selectFilters(store.getState())).toStrictEqual({
          ...selectFilters(preloadedState),
          published: {
            start: newStart,
            end: selectFilters(preloadedState).published.end,
          },
        });
      });

      test("should be able to change end filter", async () => {
        const newEnd = "1995";
        const { store } = renderWithProviders(<FilterColumn />, { preloadedState });

        await changeEndInput(newEnd);

        expect(await findEndInput()).toHaveDisplayValue(newEnd);

        expect(selectFilters(store.getState())).toStrictEqual({
          ...selectFilters(preloadedState),
          published: {
            start: selectFilters(preloadedState).published.start,
            end: newEnd,
          },
        });
      });

      test("should clear only published filter when resetting", async () => {
        const { store } = renderWithProviders(<FilterColumn />, { preloadedState });

        await resetFilter();

        const defaultPublished = defaultFiltersState.filters.published;
        expect(await findStartInput()).toHaveDisplayValue(defaultPublished.start);
        expect(await findEndInput()).toHaveDisplayValue(defaultPublished.end);

        expect(selectFilters(store.getState())).toStrictEqual({
          ...selectFilters(preloadedState),
          published: defaultPublished,
        });
      });
    });

    describe(AlbumColumn.ADD_DATE, () => {
      const column = AlbumColumn.ADD_DATE;
      const preloadedState = createFiltersRootState({ filters: { column, text, published, addDate } });

      test("should render add date filter", async () => {
        renderWithProviders(<FilterColumn />, { preloadedState });

        expect(await findColumnOption()).toHaveValue(column);
        expect(await findStartInput()).toHaveValue(addDate.start);
        expect(await findEndInput()).toHaveValue(addDate.end);
      });

      test("should be able to change start filter", async () => {
        const newStart = "1995-02-03";
        const { store } = renderWithProviders(<FilterColumn />, { preloadedState });

        await changeStartInput(newStart);

        expect(await findStartInput()).toHaveDisplayValue(newStart);

        expect(selectFilters(store.getState())).toStrictEqual({
          ...selectFilters(preloadedState),
          addDate: {
            start: newStart,
            end: selectFilters(preloadedState).addDate.end,
          },
        });
      });

      test("should be able to change end filter", async () => {
        const newEnd = "2005-06-01";
        const { store } = renderWithProviders(<FilterColumn />, { preloadedState });

        await changeEndInput(newEnd);
        
        expect(await findEndInput()).toHaveDisplayValue(newEnd);

        expect(selectFilters(store.getState())).toStrictEqual({
          ...selectFilters(preloadedState),
          addDate: {
            start: selectFilters(preloadedState).addDate.start,
            end: newEnd,
          },
        });
      });

      test("should clear only addDate filter when resetting", async () => {
        const { store } = renderWithProviders(<FilterColumn />, { preloadedState });
        
        await resetFilter();

        const defaultAddDate = defaultFiltersState.filters.addDate;
        expect(await findStartInput()).toHaveDisplayValue(defaultAddDate.start);
        expect(await findEndInput()).toHaveDisplayValue(defaultAddDate.end);

        expect(selectFilters(store.getState())).toEqual({
          ...selectFilters(preloadedState),
          addDate: defaultAddDate,
        });
      });
    });
  });
});
