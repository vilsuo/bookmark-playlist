import { describe, expect, test } from "@jest/globals";
import { createAlbumWithCategory, createFilteringAndSortingRootState } from "../../../../test/creators";
import { selectSortedAndFilteredAlbums } from "./filterSort";
import { Album, AlbumColumn, Order } from "../../../types";
import { albums } from "../../../../test/constants";
import { CATEGORY_ALL } from "../../../constants";

// do not care about ordering at this point
const tempSortfn = (a: Album, b: Album) => a.id - b.id;

const expectEqualAlbumsWithoutOrder = (result: Album[], expected: Album[]) => {
  expect(result.toSorted(tempSortfn))
    .toStrictEqual(expected.toSorted(tempSortfn));
};

/**
 * Create date string in form YYYY-MM-DD
 * 
 * @param year the year, with four digits (0000 to 9999)
 * @param month the month, with two digits (01 to 12). Defaults to 1
 * @param date the day of the month, with two digits (01 to 31). Defaults to 1
 * @returns 
 */
const createDateString = (year: number, month: number = 1, date: number = 1) => {
  const YYYY = `0000${year}`.slice(-4);
  const MM = `00${month}`.slice(-2);
  const DD = `00${date}`.slice(-2);
  return `${YYYY}-${MM}-${DD}`;
};

describe("Albums slice filtering and sorting albums", () => {
  describe("selectSortedAndFilteredAlbums", () => {
    test("should return empty array when there are no albums", () => {
      const state = createFilteringAndSortingRootState({
        albums: [],
        filters: { categories: CATEGORY_ALL },
      });

      const result = selectSortedAndFilteredAlbums(state);
      expect(result).toHaveLength(0);
    });

    describe("filtering", () => {
      describe("Categories array", () => {
        test("should return all albums when all filter categories on toggle on", () => {
          const state = createFilteringAndSortingRootState({
            albums,
            filters: { categories: CATEGORY_ALL },
          });
  
          const result = selectSortedAndFilteredAlbums(state);
          expect(result).toHaveLength(albums.length);

          expectEqualAlbumsWithoutOrder(result, albums);
        });

        test("should return none when all filter does not have any categories", () => {
          const state = createFilteringAndSortingRootState({
            albums,
            filters: { categories: [] },
          });
  
          const result = selectSortedAndFilteredAlbums(state);
          expect(result).toHaveLength(0);
        });

        test("should only return the albums with a filtered category", () => {
          const [ album, ...rest ] = albums;
          const filterCategory = "Unique";
          const albumWithCategory = createAlbumWithCategory(album, filterCategory);

          const state = createFilteringAndSortingRootState({
            albums: [ albumWithCategory, ...rest ],
            filters: { categories: [filterCategory] },
          });
  
          const result = selectSortedAndFilteredAlbums(state);
          expect(result).toHaveLength(1);
          expect(result[0]).toStrictEqual(albumWithCategory);
        });
      });

      describe("Other", () => {
        const categories = CATEGORY_ALL;

        test(AlbumColumn.ARTIST, () => {
          const state = createFilteringAndSortingRootState({
            albums, filters: {
              text: "stifi",
              column: AlbumColumn.ARTIST,
              categories,
            },
          });

          const result = selectSortedAndFilteredAlbums(state);
          expectEqualAlbumsWithoutOrder(result, [ albums[3], albums[4] ]);
        });

        test(AlbumColumn.ALBUM, () => {
          const state = createFilteringAndSortingRootState({
            albums, filters: {
              text: "of",
              column: AlbumColumn.ALBUM,
              categories,
            },
          });

          const result = selectSortedAndFilteredAlbums(state);
          expectEqualAlbumsWithoutOrder(result, [ albums[0], albums[1] ]);
        });

        describe(AlbumColumn.PUBLISHED, () => {
          const column = AlbumColumn.PUBLISHED;

          const small = "1900";
          const large = "2100";

          describe("just start filter", () => {
            test("should return all with a small start filter", () => {
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start: small,  end: "" },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expectEqualAlbumsWithoutOrder(result, albums);
            });

            test("should return none with a large start filter", () => {
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start: large,  end: "" },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toHaveLength(0);
            });

            test("should include the start filter", () => {
              const start = "1993"
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start,  end: "" },
                  column,
                  categories,
                },
              });

              const containedAlbum = albums[3];
              expect(containedAlbum.published).toBe(Number(start));

              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toContainEqual(containedAlbum);
            });

            test("should not include earlier than the start filter", () => {
              const start = "1991"
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start,  end: "" },
                  column,
                  categories,
                },
              });

              const notContainedAlbum = albums[1];
              expect(notContainedAlbum.published).toBeLessThan(Number(start));
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).not.toContainEqual(notContainedAlbum);
            });

            test("should include all later than the start filter", () => {
              const start = "1991"
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start,  end: "" },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toContainEqual(albums[3]);
              expect(albums[3].published).toBeGreaterThan(Number(start));

              expect(result).toContainEqual(albums[4]);
              expect(albums[4].published).toBeGreaterThan(Number(start));
            });
          });

          describe("just end filter", () => {
            test("should return none with a small end filter", () => {
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start: "",  end: small },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toHaveLength(0);
            });

            test("should return all with a large end filter", () => {
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start: "",  end: large },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expectEqualAlbumsWithoutOrder(result, albums);
            });

            test("should include the end filter", () => {
              const end = "1993"
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start: "",  end },
                  column,
                  categories,
                },
              });

              const containedAlbum = albums[3];
              expect(containedAlbum.published).toBe(Number(end));

              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toContainEqual(containedAlbum);
            });

            test("should not include later than the end filter", () => {
              const end = "1991"
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start: "",  end },
                  column,
                  categories,
                },
              });

              const notContainedAlbum = albums[0];
              expect(notContainedAlbum.published).toBeGreaterThan(Number(end));
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).not.toContainEqual(notContainedAlbum);
            });

            test("should include all earlier than the end filter", () => {
              const end = "1992"
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start: "",  end },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toContainEqual(albums[1]);
              expect(albums[1].published).toBeLessThan(Number(end));

              expect(result).toContainEqual(albums[2]);
              expect(albums[2].published).toBeLessThan(Number(end));
            });
          });

          describe("start and end filter", () => {
            test("should include edge cases", () => {
              const start = "1991";
              const end = "1992"
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start, end },
                  column,
                  categories,
                },
              });

              const result = selectSortedAndFilteredAlbums(state);

              expect(result).toContainEqual(albums[2]);
              expect(albums[2].published).toBe(Number(start));
        
              expect(result).toContainEqual(albums[0]);
              expect(albums[0].published).toBe(Number(end));
            });

            test("should not include any when start is later than end", () => {
              const start = "1993";
              const end = "1991"
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start, end },
                  column,
                  categories,
                },
              });

              expect(Number(start)).toBeGreaterThan(Number(end));
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toHaveLength(0);
            });

            test("should include only exacts when start is equal to end", () => {
              const value = "1991";
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start: value, end: value },
                  column,
                  categories,
                },
              });

              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toHaveLength(1);
              expect(result[0]).toStrictEqual(albums[2]);
              expect(albums[2].published).toBe(Number(value));
            });

            test("should include all when range is wide", () => {
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  published: { start: small, end: large },
                  column,
                  categories,
                },
              });

              const result = selectSortedAndFilteredAlbums(state);
              expectEqualAlbumsWithoutOrder(result, albums);
            });
          });
        });

        describe(AlbumColumn.ADD_DATE, () => {
          const column = AlbumColumn.ADD_DATE;

          const small = createDateString(1900, 1, 1);
          const large = createDateString(2100, 12, 31);

          describe("just start filter", () => {
            test("should return all with a small start filter", () => {
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start: small,  end: "" },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expectEqualAlbumsWithoutOrder(result, albums);
            });

            test("should return none with a large start filter", () => {
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start: large,  end: "" },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toHaveLength(0);
            });

            test("should include the start filter", () => {
              const start = createDateString(2022, 5, 28);
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start,  end: "" },
                  column,
                  categories,
                },
              });

              const containedAlbum = albums[2];

              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toContainEqual(containedAlbum);
            });

            test("should not include earlier than the start filter", () => {
              const start = createDateString(2022, 5, 28);
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start,  end: "" },
                  column,
                  categories,
                },
              });


              const notContainedAlbum = albums[3];
              expect(Date.parse(notContainedAlbum.addDate))
                .toBeLessThan(Date.parse(start));
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).not.toContainEqual(notContainedAlbum);
            });

            test("should include all later than the start filter", () => {
              const start = createDateString(2022, 5, 28);
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start,  end: "" },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toContainEqual(albums[0]);
            });
          });

          describe("just end filter", () => {
            test("should return none with a small end filter", () => {
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start: "",  end: small },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toHaveLength(0);
            });

            test("should return all with a large end filter", () => {
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start: "",  end: large },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expectEqualAlbumsWithoutOrder(result, albums);
            });

            test("should include the end filter", () => {
              const end = createDateString(2022, 5, 28);
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start: "",  end },
                  column,
                  categories,
                },
              });

              const containedAlbum = albums[2];

              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toContainEqual(containedAlbum);
            });

            test("should not include later than the end filter", () => {
              const end = createDateString(2022, 5, 28);
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start: "",  end },
                  column,
                  categories,
                },
              });


              const notContainedAlbum = albums[0];
              expect(Date.parse(notContainedAlbum.addDate))
                .toBeGreaterThan(Date.parse(end));
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).not.toContainEqual(notContainedAlbum);
            });

            test("should include all earlier than the end filter", () => {
              const end = createDateString(2022, 5, 28);
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start: "",  end },
                  column,
                  categories,
                },
              });
        
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toContainEqual(albums[3]);
              expect(result).toContainEqual(albums[4]);
            });
          });
          
          describe("start and end filter", () => {
            test("should include edge cases", () => {
              const start = createDateString(2022, 5, 7);
              const end = createDateString(2022, 5, 28);
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start,  end },
                  column,
                  categories,
                },
              });

              const result = selectSortedAndFilteredAlbums(state);

              expect(result).toContainEqual(albums[1]);
              expect(result).toContainEqual(albums[3]);
            });

            test("should not include any when start is later than end", () => {
              const start = createDateString(2022, 5, 29);
              const end = createDateString(2022, 5, 27);
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start, end },
                  column,
                  categories,
                },
              });

              expect(Date.parse(albums[1].addDate)).toBeLessThan(Date.parse(start));
              expect(Date.parse(albums[1].addDate)).toBeGreaterThan(Date.parse(end));

              expect(Date.parse(start)).toBeGreaterThan(Date.parse(end));
              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toHaveLength(0);
            });

            test("should include only exacts when start is equal to end", () => {
              const value = createDateString(2022, 6, 20);
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start: value, end: value },
                  column,
                  categories,
                },
              });

              const result = selectSortedAndFilteredAlbums(state);
              expect(result).toHaveLength(1);
              expect(result[0]).toStrictEqual(albums[0]);
            });

            test("should include all when range is wide", () => {
              const state = createFilteringAndSortingRootState({
                albums, filters: {
                  addDate: { start: small,  end: large },
                  column,
                  categories,
                },
              });

              const result = selectSortedAndFilteredAlbums(state);
              expectEqualAlbumsWithoutOrder(result, albums);
            });
          });
        });
      });
    });

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

    test("should not compute again with the same state", () => {
      const state = createFilteringAndSortingRootState({ albums });

      selectSortedAndFilteredAlbums.resetRecomputations();

      selectSortedAndFilteredAlbums(state);
      expect(selectSortedAndFilteredAlbums.recomputations()).toBe(1);

      selectSortedAndFilteredAlbums(state);
      expect(selectSortedAndFilteredAlbums.recomputations()).toBe(1);
    });

    test("should recompute with a new state", () => {
      const firstState = createFilteringAndSortingRootState({
        albums,
        sorting: { column: AlbumColumn.ARTIST, order: Order.ASC },
        filters: { text: "test" },
      });

      // change sort column
      const secondState = createFilteringAndSortingRootState({ 
        albums,
        sorting: { column: AlbumColumn.ALBUM, order: Order.ASC },
        filters: { text: "test" },
      });

      selectSortedAndFilteredAlbums.resetRecomputations();

      selectSortedAndFilteredAlbums(firstState);
      expect(selectSortedAndFilteredAlbums.recomputations()).toBe(1);

      selectSortedAndFilteredAlbums(secondState);
      expect(selectSortedAndFilteredAlbums.recomputations()).toBe(2);
    });
  });
});
