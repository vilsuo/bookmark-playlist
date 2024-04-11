import supertest from 'supertest';
import app from '../app';
import { AlbumBase } from '../types';
import { convertEpoch } from '../bookmark/linkParser';
import { FIELD_NAME, FILE_FIELD } from '../util/fileUpload';
import { MessageBody } from '../../test/types';
import { AppDataSource, connectToDatabase } from '../util/dataSource';
import { AlbumRepository } from '../album/album.repository';

const api = supertest(app);

const ROOT_HEADER = 'Bookmarks bar';
const CHILD_HEADER = 'Example';
const SUB_HEADER = 'Sub';

const FILEPATH = './test/samples/bookmarks-example.html';

// first link in ROOT is not youtube
// first link in CHILD has a title without a year
// first link in SUB has a missing add_date attribute
const BAD_FILEPATH = './test/samples/bookmarks-bad-example.html';

const EXPECTED: Omit<AlbumResponse, 'id'>[] = [
  {
    videoId: 'IdRn9IYWuaQ',
    artist: 'Annihilator',
    title: 'Alice In Hell',
    published: 1989,
    category: ROOT_HEADER,
    addDate: convertEpoch(1653126836).toJSON(),
  },
  {
    videoId: '5av2oGfw34g',
    artist: 'A.O.D',
    title: 'Altars of Destruction',
    published: 1989,
    category: CHILD_HEADER,
    addDate: convertEpoch(1711378433).toJSON(),
  },
  {
    videoId: 'zopfZLQibWw',
    artist: 'Nuclear Assault',
    title: 'Survive',
    published: 1988,
    category: CHILD_HEADER,
    addDate: convertEpoch(1711378636).toJSON(),
  },
  {
    videoId: 'DopHEl-BCGQ',
    artist: 'Angel Dust',
    title: 'Into the Dark Past',
    published: 1986,
    category: SUB_HEADER,
    addDate: convertEpoch(1711378617).toJSON(),
  },
  {
    videoId: 'MV3yQFU3Z6s',
    artist: 'Paradox',
    title: 'Product of Imagination',
    published: 1987,
    category: SUB_HEADER,
    addDate: convertEpoch(1711378656).toJSON(),
  },
  {
    videoId: 'Zof79HxNpMs',
    artist: 'Exodus',
    title: 'Fabulous Disaster',
    published: 1989,
    category: CHILD_HEADER,
    addDate: convertEpoch(1711378682).toJSON(),
  },
];

type AlbumResponse = Omit<AlbumBase, 'addDate'> & { id: number, addDate: string };

const postBookmarks = async (
  foldername: string,
  filename: string,
  statusCode = 201,
): Promise<AlbumResponse[] | MessageBody> => {
  const response = await api
    .post('/api/bookmark')
    .field(FIELD_NAME, foldername)
    .attach(FILE_FIELD, filename)
    .expect(statusCode)
    .expect('Content-Type', /application\/json/);

  return response.body;
};

const expectToContainAlbum = (
  albums: AlbumResponse[], 
  album: Omit<AlbumResponse, 'id'>,
) => {
  expect(albums).toContainEqual(
    expect.objectContaining({
      id: expect.any(Number),
      ...album,
    }),
  );
};

const expectAlbum = (
  responseAlbum: AlbumResponse,
  expectedAlbum: Omit<AlbumResponse, 'id'>,
) => {
  expect(responseAlbum).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      ...expectedAlbum,
    }),
  );
};

describe('post bookmarks', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    await AlbumRepository.clear();
  });

  describe('getting links from root folder', () => {
    let responseBody: AlbumResponse[];

    beforeEach(async () => {
      responseBody = (await postBookmarks(
        ROOT_HEADER,
        FILEPATH,
      )) as AlbumResponse[];
    });

    it('finds all links', () => {
      expect(responseBody).toHaveLength(EXPECTED.length);
    });

    it('the category is given by root when the link is not in a nested folder', () => {
      const rootAlbums = responseBody.filter(
        (album) => album.category === ROOT_HEADER,
      );

      expect(rootAlbums).toHaveLength(1);
      expectAlbum(rootAlbums[0], EXPECTED[0]);
    });

    it('the links inside child folders have the child categories', () => {
      const childAlbums = responseBody.filter(
        (album) => album.category === CHILD_HEADER,
      );

      expect(childAlbums).toHaveLength(3);
      expectToContainAlbum(childAlbums, EXPECTED[1]);
      expectToContainAlbum(childAlbums, EXPECTED[2]);
      expectToContainAlbum(childAlbums, EXPECTED[5]);

      const subAlbums = responseBody.filter(
        (album) => album.category === SUB_HEADER,
      );
      expect(subAlbums).toHaveLength(2);
      expectToContainAlbum(subAlbums, EXPECTED[3]);
      expectToContainAlbum(subAlbums, EXPECTED[4]);
    });
  });

  describe('gettings links from child folder', () => {
    let responseBody: AlbumResponse[];

    beforeEach(async () => {
      responseBody = (await postBookmarks(
        CHILD_HEADER,
        FILEPATH,
      )) as AlbumResponse[];
    });

    it('finds exactly all links inside the folder', () => {
      expect(responseBody).toHaveLength(5);

      expect(responseBody).not.toContainEqual(
        expect.objectContaining(EXPECTED[0]),
      );
    });

    it('finds the links before sub folder', () => {
      const childAlbums = responseBody.filter(
        (album) => album.category === CHILD_HEADER,
      );

      expectToContainAlbum(childAlbums, EXPECTED[1]);
      expectToContainAlbum(childAlbums, EXPECTED[2]);
    });

    it('finds the links after sub folder', () => {
      const childAlbums = responseBody.filter(
        (album) => album.category === CHILD_HEADER,
      );
      expectToContainAlbum(childAlbums, EXPECTED[5]);
    });

    it('the links inside child folders have the child categories', () => {
      const subAlbums = responseBody.filter(
        (album) => album.category === SUB_HEADER,
      );
      expect(subAlbums).toHaveLength(2);
      expectToContainAlbum(subAlbums, EXPECTED[3]);
      expectToContainAlbum(subAlbums, EXPECTED[4]);
    });
  });

  // bad field
  it('folder specified by field name must exist', async () => {
    const badHeader = 'Private';
    const responseBody = (await postBookmarks(
      badHeader,
      FILEPATH,
      400,
    )) as MessageBody;

    expect(responseBody.message).toMatch(`Header '${badHeader}' was not found`);
  });

  // bad file
  it('can not post a txt file', async () => {
    const badFilepath = './test/samples/text.txt';
    const responseBody = (await postBookmarks(
      ROOT_HEADER,
      badFilepath,
      400,
    )) as MessageBody;

    expect(responseBody.message).toMatch(/html/i);
  });

  // missing values
  describe('can not post without a', () => {
    it('header field', async () => {
      const response = await api
        .post('/api/bookmark')
        .attach(FILE_FIELD, FILEPATH)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const responseBody = response.body as MessageBody;
      expect(responseBody.message).toMatch(/Field is missing/i);
    });

    it('file', async () => {
      const response = await api
        .post('/api/bookmark')
        .field(FIELD_NAME, ROOT_HEADER)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const responseBody = response.body as MessageBody;
      expect(responseBody.message).toMatch(/File is missing/i);
    });
  });

  describe('bad link details', () => {
    it('link is not a youtube link', async () => {
      const responseBody = (await postBookmarks(
        ROOT_HEADER,
        BAD_FILEPATH,
        400,
      )) as MessageBody;
      expect(responseBody.message).toMatch(/href attribute/i);
    });

    it('missing publish year', async () => {
      const responseBody = (await postBookmarks(
        CHILD_HEADER,
        BAD_FILEPATH,
        400,
      )) as MessageBody;
      expect(responseBody.message).toMatch(/year/i);
    });

    it('missing add_date', async () => {
      const responseBody = (await postBookmarks(
        SUB_HEADER,
        BAD_FILEPATH,
        400,
      )) as MessageBody;
      expect(responseBody.message).toMatch(/add_date attribute/i);
    });
  });
});
