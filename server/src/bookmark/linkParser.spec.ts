import { ALBUM_BASE, FOLDER_LINK } from '../../test/constants';
import { FolderLink } from '../types';
import { createAlbumBases } from './linkParser';

const expectToThrow = (invalidLink: FolderLink) => {
  expect(() => createAlbumBases([invalidLink])).toThrow(Error);
};

describe('createAlbumBases', () => {
  const link = FOLDER_LINK;

  describe('with valid link syntax', () => {
    const expected = ALBUM_BASE;

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
    it('title without artist & album separator', () => {
      expectToThrow({
        ...link,
        text: 'Annihilator Alice In Hell (1989)',
      });
    });

    it('title without a publishing year', () => {
      expectToThrow({
        ...link,
        text: 'Annihilator - Alice In Hell',
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
