import { describe, expect, test } from "@jest/globals";
import { createAlbumsState, createFilterState } from "../../../../test/creators";
import { RootState } from "../../store";
import { selectSortedAndFilteredAlbums } from "./filterSort";
import { Filter, Sort } from "../filters/filterSlice";
import { Album, AlbumColumn, Order } from "../../../types";
import { albums } from "../../../../test/constants";

const createFilteringAndSortingRootState = (
  { albums = [], sorting, filters }: {
    albums?: Album[],
    sorting?: Sort,
    filters?: Partial<Filter>,
  } = {}
): RootState => (
  {
    albums: createAlbumsState({ albums }) ,
    filters: createFilterState({ sorting, filters }),
  } as RootState
);

describe("Albums slice filtering and sorting albums", () => {
  describe("selectSortedAndFilteredAlbums", () => {
    test("should return empty array when there are no albums", () => {
      const state = createFilteringAndSortingRootState();

      const result = selectSortedAndFilteredAlbums(state);
      expect(result).toHaveLength(0);
    });

    /*
    describe.only("filtering", () => {

    }); 
    */

    describe("sorting", () => {
      test(AlbumColumn.ARTIST, () => {
        const column = AlbumColumn.ARTIST;

        const stateAsc = createFilteringAndSortingRootState({
          albums,
          sorting: { column, order: Order.ASC }
        });

        const resultAsc = selectSortedAndFilteredAlbums(stateAsc);
        expect(resultAsc).toStrictEqual([
          albums[1],
          albums[2],
          albums[0],
          albums[3],
          albums[4],
        ]);

        const stateDesc = createFilteringAndSortingRootState({
          albums,
          sorting: { column, order: Order.DESC }
        });

        const resultDesc = selectSortedAndFilteredAlbums(stateDesc);
        expect(resultDesc).toStrictEqual([
          albums[3],
          albums[4],
          albums[0],
          albums[2],
          albums[1],
        ]);
      });

      test(AlbumColumn.ALBUM, () => {
        const column = AlbumColumn.ALBUM;

        const stateAsc = createFilteringAndSortingRootState({
          albums,
          sorting: { column, order: Order.ASC }
        });

        const resultAsc = selectSortedAndFilteredAlbums(stateAsc);
        expect(resultAsc).toStrictEqual([
          albums[3],
          albums[1],
          albums[0],
          albums[4],
          albums[2],
        ]);

        const stateDesc = createFilteringAndSortingRootState({
          albums,
          sorting: { column, order: Order.DESC }
        });

        const resultDesc = selectSortedAndFilteredAlbums(stateDesc);
        expect(resultDesc).toStrictEqual([
          albums[2],
          albums[4],
          albums[0],
          albums[1],
          albums[3],
        ]);
      });

      test(AlbumColumn.PUBLISHED, () => {
        const column = AlbumColumn.PUBLISHED;

        const stateAsc = createFilteringAndSortingRootState({
          albums,
          sorting: { column, order: Order.ASC }
        });

        const resultAsc = selectSortedAndFilteredAlbums(stateAsc);
        expect(resultAsc).toStrictEqual([
          albums[1],
          albums[2],
          albums[0],
          albums[4],
          albums[3],
        ]);

        const stateDesc = createFilteringAndSortingRootState({
          albums,
          sorting: { column, order: Order.DESC }
        });

        const resultDesc = selectSortedAndFilteredAlbums(stateDesc);
        expect(resultDesc).toStrictEqual([
          albums[3],
          albums[0],
          albums[4],
          albums[2],
          albums[1],
        ]);
      });

      test(AlbumColumn.ADD_DATE, () => {
        const column = AlbumColumn.ADD_DATE;

        const stateAsc = createFilteringAndSortingRootState({
          albums,
          sorting: { column, order: Order.ASC }
        });

        const resultAsc = selectSortedAndFilteredAlbums(stateAsc);
        expect(resultAsc).toStrictEqual([
          albums[3],
          albums[4],
          albums[2],
          albums[1],
          albums[0],
        ]);

        const stateDesc = createFilteringAndSortingRootState({
          albums,
          sorting: { column, order: Order.DESC }
        });

        const resultDesc = selectSortedAndFilteredAlbums(stateDesc);
        expect(resultDesc).toStrictEqual([
          albums[0],
          albums[1],
          albums[2],
          albums[4],
          albums[3],
        ]);
      });
    });
  });
});
