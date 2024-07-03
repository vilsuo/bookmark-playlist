import { Album, AlbumCreation } from "../src/types";

export const albums: Album[] = [
  {
    id: 1841,
    videoId: "JMAbKMSuVfI",
    artist: "Massacra",
    title: "Signs of the Decline",
    published: 1992,
    category: "Death",
    addDate: "2022-06-20T11:22:04.000Z",
  },
  {
    id: 1781,
    videoId: "3uSM-ihNGHs",
    artist: "Bolt Thrower",
    title: "Realm of Chaos",
    published: 1989,
    category: "Death",
    addDate: "2022-05-28T10:57:56.000Z",
  },
  {
    id: 1791,
    videoId: "iNSl0Gtb8YI",
    artist: "Convulse",
    title: "World Without God",
    published: 1991,
    category: "Death",
    addDate: "2022-05-28T10:37:36.000Z",
  },
  {
    id: 1845,
    videoId: "9vRqQ8Gd49Y",
    artist: "Mystifier",
    title: "Göetia",
    published: 1993,
    category: "Death",
    addDate: "2022-05-07T10:58:56.000Z",
  },
  {
    id: 1844,
    videoId: "fbVr1Xc3b18",
    artist: "Mystifier",
    title: "Wicca",
    published: 1992,
    category: "Death",
    addDate: "2022-05-07T10:59:18.000Z",
  },
];

export const newAlbumValues: AlbumCreation = {
  videoId: "GIfk8RgZ_lo",
  artist: "Sentenced",
  title: "Rotting Ways To Misery",
  published: 1991,
  category: "Death",
};

export const categories: Array<Album["category"]> = ["Thrash", "Death", "Black", "Doom"];
