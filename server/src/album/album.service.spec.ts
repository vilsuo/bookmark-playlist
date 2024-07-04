import * as albumService from './album.service';
import { AlbumBase } from '../types';
import { AppDataSource } from '../util/dataSource';
import { AlbumRepository } from './album.repository';
import { AlbumValidationError } from '../util/errors';
import { Album } from './album.entity';

const bases: AlbumBase[] = [
  {
    videoId: "eg-17oBxCIU",
    artist: "Angel Dust",
    title: "Into the Dark Past",
    published: 1986,
    category: "Thrash",
    addDate: new Date("2022-06-17T10:50:59.000Z"),
  },
  {
    videoId: "C7am7hzHixY",
    artist: "Angel Dust",
    title: "To Dust You Will Decay",
    published: 1988,
    category: "Thrash",
    addDate: new Date("2022-06-17T10:51:24.000Z"),
  },
];

describe('albumService', () => {
  const base = bases[0];
  const badBase = { ...bases[1], videoId: '42' };

  beforeAll(async () => {
    await AppDataSource.initialize();
  });
  
  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    // reset db
    await AlbumRepository.clear();
  });

  describe('createIfNotExists', () => {
    describe('successful', () => {
      it('can create an album when it does not exist', async () => {
        const album = await albumService.createIfNotExists(base);
        expect(album).toStrictEqual(
          expect.objectContaining({
            id: expect.any(Number), // any number is assigned as id
            ...base,
          })
        );
      });

      it('creating increments albums count', async () => {
        const before = await albumService.findAll();
        expect(before).toHaveLength(0);

        await albumService.createIfNotExists(base);
        const after = await albumService.findAll();
        expect(after).toHaveLength(1);
      });
    });

    describe('unsucceful', () => {
      it('undefined is returned when creating already existing album', async () => {
        await albumService.createIfNotExists(base);

        const album = await albumService.createIfNotExists(base);
        expect(album).toBe(undefined);

        const count = await albumService.findAll();
        expect(count).toHaveLength(1);
      });

      it('bad properties will throw validation error', async () => {
        await expect(async () => await albumService.createIfNotExists(badBase))
          .rejects.toThrow(AlbumValidationError);

        const count = await albumService.findAll();
        expect(count).toHaveLength(0);
      });
    });
  });

  describe('createAndSaveMany', () => {
    it('can create multiple albums', async () => {
      const createdMany = await albumService.createIfNotExistsMany(bases);

      expect(await albumService.findAll())
        .toHaveLength(bases.length);

      bases.forEach((b) => {
        expect(createdMany).toContainEqual(
          expect.objectContaining(b)
        );
      });
    });

    it('when an album validation fails, no albums are created', async () => {
      await expect(async () => await albumService.createIfNotExistsMany([base, badBase]))
        .rejects.toThrow(AlbumValidationError);

      expect(await albumService.findAll()).toHaveLength(0);
    });

    it('when an album exists, it is not recreated', async () => {
      await albumService.createIfNotExists(base);

      const createdMany = await albumService.createIfNotExistsMany(bases);

      expect(createdMany).toHaveLength(bases.length - 1);

      expect(createdMany).not.toContainEqual(
        expect.objectContaining(base)
      );

      expect(createdMany).toContainEqual(
        expect.objectContaining(bases[1])
      );
    });
  });

  describe('update', () => {
    let album: Album | undefined;

    beforeEach(async () => {
      album = await albumService.createIfNotExists(base);
    });

    it('can update album', async () => {
      const { addDate, ...newValues } = bases[1];
      const result = await albumService.update(album!.id, bases[1]);

      expect(result).toStrictEqual(
        expect.objectContaining({
          id: album!.id, // old id
          ...newValues,  // new values
        })
      );
    });

    it('should not update add date', async () => {
      const result = await albumService.update(album!.id, bases[1]);

      expect(result.addDate).toStrictEqual(album?.addDate);
      expect(result.addDate).not.toStrictEqual(bases[1].addDate);
    });

    it('can not update album with bad values', async () => {
      await expect(async () => await albumService.update(album!.id, badBase))
        .rejects.toThrow(AlbumValidationError);

      const albums = await albumService.findAll();
      expect(albums).toHaveLength(1);
      expect(albums[0]).toStrictEqual(album);
    });
  });

  it('can remove an album', async () => {
    const album = await albumService.createIfNotExists(base);

    await albumService.remove(album!.id);

    expect(await albumService.findAll()).toHaveLength(0);
  });
});
