import { PipeTransform } from "@nestjs/common";

export class LeagueIdPipe implements PipeTransform {
  transform(value: string): string {
    return value.replaceAll("_", "/");
  }
}
