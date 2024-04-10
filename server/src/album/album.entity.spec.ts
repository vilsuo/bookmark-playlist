import { ValidationError, validate } from 'class-validator';
import { ALBUM_BASE, createAlbum } from '../../test/constants';
import { VIDEO_ID_LENGTH } from './album.decorators';

describe('validation', () => {
  it('validation can succeed', async () => {
    const errors = await validate(createAlbum(ALBUM_BASE));
    expect(errors).toHaveLength(0);
  });

  describe('"videoId" column', () => {
    const expectVideoIdError = (errors: ValidationError[]) => {
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('videoId');
      expect(errors[0].constraints).toStrictEqual({
        'isVideoId': 'length must be 11 and only characters [A-Za-z0-9_-] are allowed',
      });
    };

    it('incorrect length is validation error', async () => {
      const album = createAlbum({ ...ALBUM_BASE, videoId: 'incorrect' });
      
      expect(album.videoId).not.toHaveLength(VIDEO_ID_LENGTH);

      const errors = await validate(album)
      expectVideoIdError(errors);
    });

    describe('characters', () => {
      it.each([' ', '?', '&', '='])
      ('containing "%s" is validation error', async (char: string) => {
        const album = createAlbum({
          ...ALBUM_BASE,
          videoId: char + ALBUM_BASE.videoId.substring(1),
        });
        
        const errors = await validate(album)
        expectVideoIdError(errors);
      });
    });
  });

  describe('"published" column', () => {
    it('too small is validation error', async () => {
      const album = createAlbum({ ...ALBUM_BASE, published: 992 });

      const errors = await validate(album);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('published');
      expect(errors[0].constraints).toStrictEqual({
        'min': 'number is too small',
      });
    });

    it('too large is validation error', async () => {
      const album = createAlbum({ ...ALBUM_BASE, published: 19992 });

      const errors = await validate(album);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('published');
      expect(errors[0].constraints).toStrictEqual({
        'max': 'number is too large',
      });
    });
  });
});
