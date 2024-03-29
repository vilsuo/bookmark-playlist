import { Album, CategoryLink } from '../../src/types';
import {
  convertEpoch,
  createAlbumsFromLinks,
} from '../../src/services/albumService';

const link: CategoryLink = {
  title: 'Annihilator - Alice In Hell (1989)',
  href: 'https://www.youtube.com/watch?v=IdRn9IYWuaQ',
  addDate: '1711022745',
  category: 'Thrash',
};

const expectToThrow = (invalidLink: CategoryLink) => {
  expect(() => createAlbumsFromLinks([invalidLink])).toThrow(Error);
};

describe('createAlbumsFromLinks', () => {
  describe('with valid link syntax', () => {
    const expected: Album = {
      videoId: 'IdRn9IYWuaQ',
      artist: 'Annihilator',
      title: 'Alice In Hell',
      published: 1989,
      category: 'Thrash',
      addDate: convertEpoch(1711022745),
    };

    const albums = createAlbumsFromLinks([link]);
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
      const invalidLink = { ...link, href: undefined };

      expectToThrow(invalidLink);
    });

    it('invalid href prefix', () => {
      const invalidLink = {
        ...link,
        href: 'https://www.youtub.com/watch?v=IdRn9IYWuaQ',
      };

      expectToThrow(invalidLink);
    });

    it('too short href', () => {
      const invalidLink = {
        ...link,
        href: 'https://www.youtube.com/watch?v=IdRn9IYWua',
      };

      expectToThrow(invalidLink);
    });
  });

  describe('invalid add_date throws an Error', () => {
    it('missing add_date', () => {
      const invalidLink = { ...link, addDate: undefined };

      expectToThrow(invalidLink);
    });

    it('NaN add_date', () => {
      const invalidLink = {
        ...link,
        addDate: 'Thursday, March 21, 2024 12:05:45 PM',
      };

      expectToThrow(invalidLink);
    });
  });

  describe('invalid title throws an Error', () => {
    it('title without artist - album separator', () => {
      const invalidLink = {
        ...link,
        title: 'Annihilator Alice In Hell (1989)',
      };

      expectToThrow(invalidLink);
    });

    it('title with too small year', () => {
      const invalidLink = {
        ...link,
        title: 'Annihilator - Alice In Hell (198)',
      };

      expectToThrow(invalidLink);
    });

    it('title with extra letters', () => {
      const invalidLink = {
        ...link,
        title: 'Annihilator - Alice In Hell (1989) full album',
      };

      expectToThrow(invalidLink);
    });
  });
});
