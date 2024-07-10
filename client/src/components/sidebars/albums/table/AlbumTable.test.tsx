import { describe, expect, test } from "@jest/globals";
import { createFilteringAndSortingRootState } from "../../../../../test/creators";
import AlbumTable from "./AlbumTable";
import { renderWithProviders } from "../../../../../test/testUtils";
import { albums } from "../../../../../test/constants";
import { fireEvent, screen, within } from "@testing-library/dom";
import { selectSortedAndFilteredAlbums } from "../../../../redux/reducers/albums/filterSort";
import { selectViewing } from "../../../../redux/reducers/albums/albumsSlice";
import { AlbumColumn, Order } from "../../../../types";
import { selectSorting } from "../../../../redux/reducers/filters/filterSlice";

const queryAllAlbumTableRows = () => {
  const queueTableBody = screen.getByTestId("album-tbody");
  return within(queueTableBody).queryAllByRole("row");
};

const queryAlbumTableRowByText = (text: string) => {
  const queueTableBody = screen.getByTestId("album-tbody");
  return within(queueTableBody).queryByRole("row", { name: new RegExp(text) });
};

const clickAlbumTableHeader = (column: AlbumColumn) => {
  fireEvent.click(screen.getByRole("columnheader", { name: column }));
};

describe("<AlbumTable />", () => {
  test("should render all albums default sorted without any filters", async () => {
    const preloadedState = createFilteringAndSortingRootState({ albums });

    const { store } = renderWithProviders(<AlbumTable />, { preloadedState });

    const rows = queryAllAlbumTableRows();
    expect(rows).toHaveLength(albums.length);

    selectSortedAndFilteredAlbums(store.getState()).forEach((a, i) => {
      expect(rows[i]).toHaveTextContent(a.title);
    });
  });

  test("should render subset of albums with filters", async () => {
    const filters = { column: AlbumColumn.ARTIST, text: "mysti" };
    const preloadedState = createFilteringAndSortingRootState({ albums, filters });

    renderWithProviders(<AlbumTable />, { preloadedState });

    const rows = queryAllAlbumTableRows();
    expect(rows).not.toHaveLength(albums.length);
  });

  test("should be able to change sorting order", () => {
    const sorting = { column: AlbumColumn.ARTIST, order: Order.ASC };
    const preloadedState = createFilteringAndSortingRootState({ albums, sorting });
    const { store } = renderWithProviders(<AlbumTable />, { preloadedState });

    const orderingBefore = selectSortedAndFilteredAlbums(store.getState());

    // click same header to change order
    clickAlbumTableHeader(AlbumColumn.ARTIST);

    const orderingAfter = selectSortedAndFilteredAlbums(store.getState());

    expect(selectSorting(store.getState()).column).toBe(sorting.column);
    expect(selectSorting(store.getState()).order).toBe(Order.DESC);

    const rows = queryAllAlbumTableRows();
    expect(rows).toHaveLength(albums.length);

    expect(orderingBefore).not.toEqual(orderingAfter);
  });

  test("should be able to change sorting column", () => {
    const sorting = { column: AlbumColumn.ARTIST, order: Order.ASC };
    const preloadedState = createFilteringAndSortingRootState({ albums, sorting });
    const { store } = renderWithProviders(<AlbumTable />, { preloadedState });

    const orderingBefore = selectSortedAndFilteredAlbums(store.getState());

    // click different header to change column
    clickAlbumTableHeader(AlbumColumn.ALBUM);

    const orderingAfter = selectSortedAndFilteredAlbums(store.getState());

    expect(selectSorting(store.getState()).column).toBe(AlbumColumn.ALBUM);
    expect(selectSorting(store.getState()).order).toBe(sorting.order);

    const rows = queryAllAlbumTableRows();
    expect(rows).toHaveLength(albums.length);

    expect(orderingBefore).not.toEqual(orderingAfter);
  });

  test("should be able to toggle view on an album", () => {
    const preloadedState = createFilteringAndSortingRootState({ albums });

    const { store } = renderWithProviders(<AlbumTable />, { preloadedState });

    const selectIdx = 1;
    const albumToBeSelected = selectSortedAndFilteredAlbums(store.getState())[selectIdx];

    // select
    fireEvent.click(queryAlbumTableRowByText(albumToBeSelected.title)!);
    expect(selectViewing(store.getState())).toBe(albumToBeSelected);

    // deselect
    fireEvent.click(queryAlbumTableRowByText(albumToBeSelected.title)!);
    expect(selectViewing(store.getState())).toBe(null);
  });
});
