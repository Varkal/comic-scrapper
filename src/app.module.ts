import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BrowserService } from "./browser.service";
import { ComicsController } from "./comics.controller";
import { SeriesController } from "./series.controller";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ComicsController, SeriesController],
  providers: [BrowserService],
})
export class AppModule {}
