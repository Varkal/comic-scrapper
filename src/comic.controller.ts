import { Controller, Get, Param } from "@nestjs/common";
import { BrowserService } from "./browser.service";

@Controller("/comics")
export class ComicController {
  constructor(private readonly browserService: BrowserService) {}

  @Get("/:id")
  async getComicById(@Param("id") id: string) {
    return this.browserService.getComicById(`${id.replaceAll("_", "/")}`);
  }
}
