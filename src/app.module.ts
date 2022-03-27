import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BrowserService } from "./browser.service";
import { ComicController } from "./comic.controller";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ComicController],
  providers: [BrowserService],
})
export class AppModule {}
