import * as dayjs from "dayjs";
import "dayjs/plugin/advancedFormat";
import "dayjs/plugin/customParseFormat";
import {
  CollectedIn,
  Comic,
  ComicCharacter,
  ComicCreator,
  ComicFeature,
  ComicRatings,
  ComicStatuses,
  KeyEvent,
  VariantCover,
} from "../interfaces/comic.interface";
import { Builder } from "./abstract.builder";

export class ComicBuilder extends Builder {
  constructor(url: string, pageContent: string, private readonly id: string) {
    super(url, pageContent);
  }

  get title(): string {
    return this.$("h1").text().trim();
  }

  get publisherName(): string {
    return this.$(".header-intro a").first().text().trim();
  }

  get ratings(): ComicRatings {
    const [likedRating, totalRating, averageRating] = this.$(".comic-score strong")
      .toArray()
      .map((a) => parseFloat(this.$(a).text().trim()));

    return {
      total: totalRating,
      liked: likedRating,
      average: averageRating,
      percentageLike: Math.round((likedRating / totalRating) * 100),
      personalRating: this.personalRating || null,
    };
  }

  get personalRating(): number {
    return parseInt(this.$("#rateit-range-2").attr("aria-valuenow"));
  }

  get releaseDate(): string {
    const dateString = this.$(".header-intro a").next().text().trim();
    console.log(dateString);

    if (!dateString) {
      return null;
    }

    return dayjs(`${dateString.replace(/TH|th|st|ST/, "")}`, "MMM D, YYYY").format("YYYY-MM-DD");
  }

  get cover(): string {
    return this.$(`img[alt="${this.title}"]`).attr("src");
  }

  get description(): string {
    return this.$(".listing-description").text().trim();
  }

  get variants(): VariantCover[] {
    return this.$(".variant-cover-list img")
      .toArray()
      .map((img) => {
        const $img = this.$(img);
        const leagueUrl = this.getUrl($img.parent().attr("href"));
        return {
          id: this.getId(leagueUrl),
          pictureUrl: $img.attr("data-src").replace("medium", "large"),
          title: $img.parent().attr("data-original-title").trim(),
          leagueUrl,
        };
      });
  }

  get features(): ComicFeature[] {
    return this.$(".details-addtl-block")
      .toArray()
      .map((el) => {
        const $el = this.$(el);
        return {
          name: $el.find(".name").text().trim(),
          value: $el.find(".value").text().trim(),
        };
      });
  }

  get creators(): ComicCreator[] {
    return this.$("#creators .col-xxl-4")
      .toArray()
      .map((el) => {
        const $el = this.$(el);
        const $a = $el.find("a");
        const leagueUrl = this.getUrl($a.attr("href"));
        return {
          id: this.getId(leagueUrl),
          name: $a.text().trim(),
          role: $el.find(".role").text().trim(),
          pictureUrl: $a.find("img").attr("src"),
          leagueUrl,
        };
      });
  }

  get characters(): ComicCharacter[] {
    return this.$("#characters .col-xxl-4")
      .toArray()
      .map((el) => {
        const $el = this.$(el);
        const $a = $el.find("a");
        const realName = $el.find(".real-name").text().trim();
        const leagueUrl = this.getUrl($a.attr("href"));
        return {
          id: this.getId(leagueUrl),
          name: $a.text().trim(),
          pictureUrl: $a.find("img").attr("src"),
          leagueUrl,
          universe: $el.find(".universe").text().trim(),
          ...(realName ? { realName } : {}),
        };
      });
  }

  get keyEvents(): KeyEvent[] {
    return this.$("#characters .col-12")
      .toArray()
      .map((el) => {
        const $el = this.$(el);
        const event = $el.find(".copy-medium > span.font-weight-bold").text().trim();
        const $characterElem = $el.find("a");
        const universe = $el.find(".copy-really-small").text().trim();
        const leagueUrl = this.getUrl($characterElem.attr("href"));
        return {
          id: this.getId(leagueUrl),
          name: $characterElem.text().trim(),
          leagueUrl,
          event,
          universe,
        };
      });
  }

  get tags(): string[] {
    return this.$(".tag-listings .item-saved span")
      .toArray()
      .map((el) => this.$(el).text().trim())
      .filter((tag) => tag !== "");
  }

  get collected(): boolean {
    return this.$(".cg-icon-collect").parent().hasClass("active");
  }

  get pulled(): boolean {
    return this.$(".cg-icon-pull").parent().hasClass("active");
  }

  get read(): boolean {
    return this.$(".cg-icon-readlist").parent().hasClass("active");
  }

  get wanted(): boolean {
    return this.$(".cg-icon-wishlist").parent().hasClass("active");
  }

  get log(): string[] {
    return this.$("#comic-read-diary-list .item-saved span")
      .toArray()
      .map((el) => this.$(el).text().trim())
      .filter((log) => log !== "")
      .map((el) => dayjs(el).format("YYYY-MM-DD"));
  }

  get statuses(): ComicStatuses {
    return {
      pulled: this.pulled,
      collected: this.collected,
      read: this.read,
      wanted: this.wanted,
    };
  }

  get datePurchased(): string {
    const datePurchased = this.$("#date_purchased").val() as string;

    if (!datePurchased) {
      return null;
    }

    return dayjs(datePurchased, "MM/DD/YYYY").format("YYYY-MM-DD");
  }

  get pricePaid(): number {
    const pricePaid = this.$("#price_paid").val() as string;

    if (!pricePaid) {
      null;
    }

    return parseFloat(pricePaid);
  }

  get quantity(): number {
    const quantity = this.$("#quantity").val() as string;
    if (!quantity) {
      return null;
    }
    return parseInt(quantity);
  }

  get purchaseStore(): string {
    const purchaseStore = this.$("#purchase_store").val() as string;
    if (!purchaseStore) {
      return null;
    }
    return purchaseStore;
  }

  get owner(): string {
    const owner = this.$("#owner").val() as string;
    if (!owner) {
      return null;
    }
    return owner;
  }

  get collectedIn(): CollectedIn {
    const collectedIn = this.$("#notes").text().trim() as string;

    if (!collectedIn) {
      return null;
    }
    return {
      raw: collectedIn,
      parsed: collectedIn.split(/\s*<[a-zA-Z0-9 \/]+>\s*/).filter((el) => el !== ""),
    };
  }

  get serie() {
    const leagueUrl = this.$(".series").attr("href") as string;
    if (!leagueUrl) {
      return null;
    }
    return {
      id: this.getId(leagueUrl),
      leagueUrl,
    };
  }

  toJSON(): Comic {
    return {
      core: {
        id: this.getId(this.id),
        serie: this.serie,
        title: this.title,
        publisherName: this.publisherName,
        releaseDate: this.releaseDate,
        leagueUrl: this.url,
        cover: this.cover,
        description: this.description,
        variants: this.variants,
        features: this.features,
        creators: this.creators,
        characters: this.characters,
        keyEvents: this.keyEvents,
      },
      statuses: this.statuses,
      ratings: this.ratings,
      log: this.log,
      ...(this.collected
        ? {
            collectionDetails: {
              datePurchased: this.datePurchased,
              pricePaid: this.pricePaid,
              quantity: this.quantity,
              purchaseStore: this.purchaseStore,
              owner: this.owner,
              tags: this.tags,
              collectedIn: this.collectedIn,
            },
          }
        : {}),
    };

    // return response;
  }
}
