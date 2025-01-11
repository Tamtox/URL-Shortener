import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UrlShortenerModule } from './modules/url-shortener/url-shortener.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UrlShortenerModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
