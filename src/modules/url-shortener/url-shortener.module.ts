import { Module } from '@nestjs/common';
import { UrlShortenerService } from './services/url-shortener.service';
import { UrlShortenerController } from './controllers/url-shortener.controller';
import { UrlShortenerRepositoryService } from './services/url-shortener-repository.service';

@Module({
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, UrlShortenerRepositoryService],
  exports: [UrlShortenerService],
})
export class UrlShortenerModule {}
