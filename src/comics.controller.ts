import { Controller, Get, Param } from "@nestjs/common";
import { BrowserService } from "./browser.service";
import { LeagueIdPipe } from "./league-id.pipe";

@Controller("/comics")
export class ComicsController {
  constructor(private readonly browserService: BrowserService) {}

  @Get("/:id")
  async getComicById(@Param("id", LeagueIdPipe) id: string) {
    return this.browserService.getComicById(`${id}`);
  }
}
