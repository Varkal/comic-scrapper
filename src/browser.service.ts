import { Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import { load } from "cheerio";
import { ComicBuilder } from "./builder/comic.builder";
import { SerieBuilder } from "./builder/serie.builder";

@Injectable()
export class BrowserService implements OnApplicationShutdown {
  private browser: puppeteer.Browser | null = null;
  private readonly logger = new Logger(BrowserService.name);

  public getUrl(path: string) {
    const url = new URL("https://leagueofcomicgeeks.com");
    url.pathname = path;
    return url.toString();
  }

  public async getPage(path: string) {
    const url = this.getUrl(path);
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
  }

  public async getPageContent(path: string) {
    const page = await this.getPage(path);
    return load(await page.content());
  }

  public async getBrowser(): Promise<puppeteer.Browser> {
    if (!this.browser) {
      this.logger.log("Creating browser");
      console.time("browser");
      this.browser = await puppeteer.launch();
      console.timeEnd("browser");
      this.logger.log("Browser created");

      console.time("login");
      this.logger.log("Navigate to login page");
      const page = await this.getPage("/login");
      this.logger.log("Type credentials");
      await page.waitForSelector("input[name=username]");
      await page.type("input[name=username]", process.env.LEAGUE_USERNAME);
      await page.type("input[name=password]", process.env.LEAGUE_PASSWORD);
      this.logger.log("Click");
      await page.click("input[type=submit]");
      await page.waitForNavigation();
      console.timeEnd("login");
    }

    return this.browser;
  }

  public async getComicById(id: string): Promise<any> {
    const url = this.getUrl(`/comic/${id}`);
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.goto(url);
    // return await page.content();
    return new ComicBuilder(url, await page.content(), id).toJSON();
  }

  public async getSerieById(id: string): Promise<any> {
    const url = this.getUrl(`/comics/series/${id}`);
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.goto(url);
    // return await page.content();
    return new SerieBuilder(url, await page.content(), id).toJSON();
  }

  async onApplicationShutdown() {
    if (this.browser) {
      this.logger.log("Closing browser");
      await this.browser.close();
    }
  }
}
