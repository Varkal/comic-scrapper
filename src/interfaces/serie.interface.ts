import { LeagueObject } from "./abstract.interface";

export interface Serie {
  id: string;
  leagueUrl: string;
  name: string;
  years: string[];
  volume: number;
  publisherName: string;
  comics: SerieComic[];
}

export interface SerieComic extends LeagueObject {
  name: string;
}
