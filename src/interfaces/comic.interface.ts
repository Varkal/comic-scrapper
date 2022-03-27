import { LeagueObject } from "./abstract.interface";

export interface Comic {
  core: ComicCore;
  statuses: ComicStatuses;
  ratings: ComicRatings;
  log: string[];
  collectionDetails?: ComicCollectedDetails;
}

export interface ComicCore extends LeagueObject {
  serie: LeagueObject;
  title: string;
  publisherName: string;
  releaseDate: string;
  cover: string;
  description: string;
  variants: VariantCover[];
  features: ComicFeature[];
  creators: ComicCreator[];
  characters: ComicCharacter[];
  keyEvents: KeyEvent[];
}

export interface ComicStatuses {
  collected: boolean;
  pulled: boolean;
  read: boolean;
  wanted: boolean;
}

export interface ComicRatings {
  total: number;
  liked: number;
  average: number;
  percentageLike: number;
  personalRating?: number;
}

export interface ComicCollectedDetails {
  datePurchased: string;
  pricePaid: number;
  quantity: number;
  purchaseStore: string;
  owner: string;
  tags: string[];
  collectedIn: CollectedIn;
}

export interface CollectedIn {
  raw: string;
  parsed: string[];
}

export interface VariantCover extends LeagueObject {
  pictureUrl: string;
  title: string;
}

export interface ComicFeature {
  name: string;
  value: string;
}

export interface ComicCreator extends LeagueObject {
  name: string;
  role: string;
  pictureUrl: string;
}

export interface ComicCharacter extends LeagueObject {
  name: string;
  pictureUrl: string;
  universe: string;
  realName?: string;
}

export interface KeyEvent extends LeagueObject {
  name: string;
  universe: string;
  event: string;
}
