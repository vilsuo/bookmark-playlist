import { Link } from '../../src/types';
import { createAlbumsFromLinks } from '../../src/util/albumService';

const link: Link = {
  title: 'Annihilator - Alice In Hell (1989)',
  href: 'https://www.youtube.com/watch?v=IdRn9IYWuaQ',
};

const expectToThrow = (invalidLink: Link) => {
  expect(() => createAlbumsFromLinks([invalidLink])).toThrow(Error);
};

describe('createAlbumsFromLinks', () => {
  describe('with valid link syntax', () => {
    const expected = {
      videoId: 'IdRn9IYWuaQ',
      artist: 'Annihilator',
      title: 'Alice In Hell',
      published: 1989,
    };

    const albums = createAlbumsFromLinks([link]);
    const album = albums[0];

    it('a single album is returned', () => {
      expect(albums).toHaveLength(1);
    });

    it('video id is correct', () => {
      expect(album.videoId).toBe(expected.videoId);
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
