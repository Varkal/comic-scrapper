import { Controller, Get, Param } from "@nestjs/common";
import { BrowserService } from "./browser.service";
import { LeagueIdPipe } from "./league-id.pipe";

@Controller("/series")
export class SeriesController {
  constructor(private readonly browserService: BrowserService) {}

  @Get("/:id")
  async getSerieById(@Param("id", LeagueIdPipe) id: string) {
    return this.browserService.getSerieById(`${id}`);
  }
}
