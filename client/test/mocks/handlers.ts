import { http, HttpResponse } from "msw";
import { Album, AlbumUpdate } from "../../src/types";

import { albums, newAlbum } from "../constants";
import { BASE_URL as ALBUMS_BASE_URL } from "../../src/util/albumService";
import { BASE_URL as CONVERTER_BASE_URL } from "../../src/util/converterService";

const albumHandlers = [
  http.get(ALBUMS_BASE_URL, async () => {
    return HttpResponse.json(albums);
  }),

  http.post(ALBUMS_BASE_URL, async () => {
    return HttpResponse.json(newAlbum, { status: 201 });
  }),

  http.put<{ id: string }, AlbumUpdate, Album>(
    `${ALBUMS_BASE_URL}/:id`,
    async ({ request, params }) => {
      const id = Number(params.id);

      // Read the intercepted request body as JSON.
      const body = await request.json();

      const addDate = albums.find(a => a.id === id)!.addDate;

      return HttpResponse.json({
        id,
        ...body,
        addDate,
      });
    },
  ),

  http.delete(`${ALBUMS_BASE_URL}/:id`, () => {
    return new Response(null, { status: 204 } );
  }),
];

const converterHandlers = [
  http.post(CONVERTER_BASE_URL, () => {
    return HttpResponse.json(albums, { status: 201 });
  }),
];

const handlers = [ ...albumHandlers, ...converterHandlers ];

export default handlers;
