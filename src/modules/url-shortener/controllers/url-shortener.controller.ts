import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Ip, Param, Post, Redirect } from '@nestjs/common';
import { UrlShortenerService } from '../services/url-shortener.service';
import { ShortenUrlDto, shortenUrlValidationSchema } from '../dtos/url-shortener.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ControllerNames } from 'src/common/constants/controllers.constant';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { UrlDto } from '../models/short-url.model';
import { UrlUsageDto } from '../models/url-usage.model';

const CONTROLLER_NAME = ControllerNames.UrlShortener as const;
const CONTROLLER_TAGS = [CONTROLLER_NAME] as const;
@Controller(CONTROLLER_NAME)
@ApiTags(...CONTROLLER_TAGS)
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}
  // #region Shorten URL ---------------------------------------------------------------------------------------------------------------------
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Shortened URL created successfully', type: UrlDto })
  @Post('shorten')
  @HttpCode(HttpStatus.CREATED)
  async shortenUrl(@Body(new ZodValidationPipe(shortenUrlValidationSchema)) shortenUrlDto: ShortenUrlDto) {
    const shortUrl = await this.urlShortenerService.createUrlProcess(shortenUrlDto);
    return shortUrl;
  }
  // #region Redirect to Original URL --------------------------------------------------------------------------------------------------------
  @ApiResponse({ status: HttpStatus.FOUND, description: 'Redirect to original URL' })
  @Get(':shortUrl')
  @Redirect('https://nestjs.com', 302)
  @HttpCode(HttpStatus.FOUND)
  async redirect(@Param('shortUrl') shortUrl: string, @Ip() ip: string) {
    const url = await this.urlShortenerService.useShortUrlProcess(shortUrl, ip);
    return { url: url.original_url };
  }
  // #region Get Original URL ----------------------------------------------------------------------------------------------------------------
  @ApiResponse({ status: HttpStatus.OK, description: 'Original URL found' })
  @Get('/info/:shortUrl')
  async getOriginalUrl(@Param('shortUrl') shortUrl: string) {
    const data = await this.urlShortenerService.getUsageStatsProcess(shortUrl);
    return data;
  }
  // #region Delete Short URL -----------------------------------------------------------------------------------------------------------------
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Short URL deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/delete/:shortUrl')
  async deleteShortUrl(@Param('shortUrl') shortUrl: string) {
    await this.urlShortenerService.deleteUrlProcess(shortUrl);
    return `Short URL ${shortUrl} was deleted successfully`;
  }
  // #endregion Get URL Usage Stats -----------------------------------------------------------------------------------------------------------
  @ApiResponse({ status: HttpStatus.OK, description: 'URL usage stats found', type: UrlUsageDto })
  @Get('/analytics/:shortUrl')
  async getUsageStats(@Param('shortUrl') shortUrl: string) {
    const usage = await this.urlShortenerService.getUsageStatsProcess(shortUrl);
    return usage.usage;
  }
}
