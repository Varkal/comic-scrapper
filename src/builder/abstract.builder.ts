import { CheerioAPI, load } from "cheerio";

export abstract class Builder<T = object> {
  constructor(protected readonly url: string, protected readonly pageContent: string) {}
  private _$: CheerioAPI | null = null;

  public getUrl(path: string): string {
    const url = new URL("https://leagueofcomicgeeks.com");
    url.pathname = path;
    return url.toString();
  }

  public getId(url: string): string {
    const path = url.startsWith("https://") ? new URL(url).pathname : url;
    return path.split("/").slice(-2).join("_");
  }

  get $(): CheerioAPI {
    if (!this._$) {
      this._$ = load(this.pageContent);
    }
    return this._$;
  }

  abstract toJSON(): T;
}
