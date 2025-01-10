import { Module } from '@nestjs/common';
import { UrlShortenerService } from './services/url-shortener.service';
import { UrlShortenerController } from './controllers/url-shortener.controller';

@Module({
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService],
  exports: [UrlShortenerService],
})
export class UrlShortenerModule {}
