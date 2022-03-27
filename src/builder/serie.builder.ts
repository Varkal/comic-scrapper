import { Serie } from "../interfaces/serie.interface";
import { Builder } from "./abstract.builder";

export class SerieBuilder extends Builder {
  constructor(url: string, pageContent: string, private readonly id: string) {
    super(url, pageContent);
  }

  get name(): string {
    return this.$("h1").text().trim();
  }

  get years(): string[] {
    const headerIntro = this.$(".header-intro").text().trim();
    const years = headerIntro.split("·").at(-1).trim().split("-");
    return years.map((year) => year.trim());
  }

  get volume(): number {
    const headerIntro = this.$(".header-intro").text().trim();
    const volume = headerIntro.split("·").at(-2).trim();
    return +volume.match(/\d+/)[0];
  }

  get publisherName(): string {
    const headerIntro = this.$(".header-intro").text().trim();
    return headerIntro.split("·")[0].trim();
  }

  get description(): string {
    return this.$("#series-summary-copy").text().trim();
  }

  get comics() {
    return this.$("#comic-list-issues .title a")
      .toArray()
      .map((a) => {
        const $a = this.$(a);
        const leagueUrl = this.getUrl($a.attr("href"));
        return {
          id: this.getId(leagueUrl),
          name: $a.text().trim(),
          leagueUrl,
        };
      })
      .sort((a, b) => {
        const aNumber = parseInt(a.name.match(/#\d+/)[0].replace("#", ""));
        const bNumber = parseInt(b.name.match(/#\d+/)[0].replace("#", ""));
        return aNumber - bNumber;
      });
  }

  toJSON(): Serie {
    return {
      id: this.id,
      leagueUrl: this.url,
      name: this.name,
      years: this.years,
      volume: this.volume,
      publisherName: this.publisherName,
      comics: this.comics,
    };
  }
}
