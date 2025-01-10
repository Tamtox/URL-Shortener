import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { UrlShortenerService } from '../services/url-shortener.service';
import { ShortenUrlDto, shortenUrlValidationSchema } from '../dtos/url-shortener.dto';
import { ApiTags } from '@nestjs/swagger';
import { ControllerNames } from 'src/common/constants/controllers.contant';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';

const CONTROLLER_NAME = ControllerNames.UrlShortener as const;
const CONTROLLER_TAGS = [CONTROLLER_NAME] as const;
@Controller(CONTROLLER_NAME)
@ApiTags(...CONTROLLER_TAGS)
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}
  // #region Shorten URL ---------------------------------------------------------------------------------------------------------------------
  @Post('shorten')
  async shortenUrl(@Body(new ZodValidationPipe(shortenUrlValidationSchema)) shortenUrlDto: ShortenUrlDto) {
    const shortUrl = await this.urlShortenerService.shortenUrl(shortenUrlDto);
    return shortUrl;
  }
  // #region Redirect to Original URL --------------------------------------------------------------------------------------------------------
  @Get(':shortUrl')
  @Redirect()
  async redirect(@Param('shortUrl') shortUrl: string) {
    const originalUrl = await this.urlShortenerService.getOriginalUrl(shortUrl);
  }
  // #region Get Original URL ----------------------------------------------------------------------------------------------------------------
  @Get('/info/:shortUrl')
  async getOriginalUrl(@Param('shortUrl') shortUrl: string) {
    return await this.urlShortenerService.getOriginalUrl(shortUrl);
  }
  // #region Delete Short URL -----------------------------------------------------------------------------------------------------------------
  @Post('/delete/:shortUrl')
  async deleteShortUrl(@Param('shortUrl') shortUrl: string) {
    return await this.urlShortenerService.deleteShortUrl(shortUrl);
  }
}
