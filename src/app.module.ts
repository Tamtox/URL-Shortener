import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UrlShortenerModule } from './modules/url-shortener/url-shortener.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, UrlShortenerModule, AnalyticsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
