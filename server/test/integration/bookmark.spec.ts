import supertest, { Response } from 'supertest';
import app from '../../src/app';
import { Album } from '../../src/types';

const api = supertest(app);

/**
 * Api 'error' response body
 */
export type MessageBody = { message: string };

// Overwrite the supertest response body to be generic
type SuperTestResponse<T> = Omit<Response, 'body'> & { body: T };

type ApiResponse<T> = SuperTestResponse<T | MessageBody>;

// Specific
type AlbumResponse = Album & { addDate: string };
type PostBookmarkResponse = ApiResponse<AlbumResponse[]>;

const postBookmarks = async (foldername: string, filename: string, statusCode: number): Promise<PostBookmarkResponse> => {
  const response = await api
    .post('/api/bookmark')
    .field('name', foldername)
    .attach('file', filename)
    .expect(statusCode)
    .expect('Content-Type', /application\/json/);
  
  return response.body;
};

describe('post bookmarks', () => {
  const foldername = 'Example';
  const filepath = './test/bookmarks-example.html';

  it('initial test', async () => {
    const responseBody = await postBookmarks(foldername, filepath, 201);

    expect(responseBody).toHaveLength(5);
  });
});
