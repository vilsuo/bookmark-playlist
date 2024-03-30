import { AlbumBase, FolderLink } from '../../src/types';
import { convertEpoch, createAlbumBases } from '../../src/util/linkParser';

const link: FolderLink = {
  text: 'Annihilator - Alice In Hell (1989)',
  href: 'https://www.youtube.com/watch?v=IdRn9IYWuaQ',
  addDate: '1711022745',
  folder: 'Thrash',
};

const expectToThrow = (invalidLink: FolderLink) => {
  expect(() => createAlbumBases([invalidLink])).toThrow(Error);
};

describe('createAlbumBases', () => {
  describe('with valid link syntax', () => {
    const expected: AlbumBase = {
      videoId: 'IdRn9IYWuaQ',
      artist: 'Annihilator',
      title: 'Alice In Hell',
      published: 1989,
      category: 'Thrash',
      addDate: convertEpoch(1711022745),
    };

    const albums = createAlbumBases([link]);
    const album = albums[0];

    it('a single album is returned', () => {
      expect(albums).toHaveLength(1);
    });

    it('video id is correct', () => {
      expect(album.videoId).toBe(expected.videoId);
    });

    it('category is correct', () => {
      expect(album.category).toBe(expected.category);
    });

    it('add date is correct', () => {
      expect(album.addDate).toStrictEqual(expected.addDate);
    });

    describe('album details', () => {
      it('artist is correct', () => {
        expect(album.artist).toBe(expected.artist);
      });

      it('title is correct', () => {
        expect(album.title).toBe(expected.title);
      });

      it('published year is correct', () => {
        expect(album.published).toBe(expected.published);
      });
    });
  });

  describe('invalid href throws an Error', () => {
    it('missing href', () => {
      expectToThrow({ ...link, href: undefined });
    });

    it('invalid href prefix', () => {
      expectToThrow({
        ...link,
        href: 'https://www.youtub.com/watch?v=IdRn9IYWuaQ',
      });
    });

    it('too short href', () => {
      expectToThrow({
        ...link,
        href: 'https://www.youtube.com/watch?v=IdRn9IYWua',
      });
    });
  });

  describe('invalid add_date throws an Error', () => {
    it('missing add_date', () => {
      expectToThrow({ ...link, addDate: undefined });
    });

    it('NaN add_date', () => {
      expectToThrow({
        ...link,
        addDate: 'Thursday, March 21, 2024 12:05:45 PM',
      });
    });
  });

  describe('invalid title throws an Error', () => {
    it('title without artist - album separator', () => {
      expectToThrow({
        ...link,
        text: 'Annihilator Alice In Hell (1989)',
      });
    });

    it('title with too small year', () => {
      expectToThrow({
        ...link,
        text: 'Annihilator - Alice In Hell (198)',
      });
    });

    it('title with extra letters', () => {
      expectToThrow({
        ...link,
        text: 'Annihilator - Alice In Hell (1989) full album',
      });
    });
  });
});
