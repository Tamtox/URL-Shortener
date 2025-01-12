import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Ip, Param, Post, Query, Redirect } from '@nestjs/common';
import { UrlShortenerService } from '../services/url-shortener.service';
import {
  ListUrlsDto,
  ListUrlsDtoQuery,
  listUrlsValidationSchema,
  ShortenUrlDto,
  shortenUrlValidationSchema,
} from '../dtos/url-shortener.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ControllerNames } from 'src/common/constants/controllers.constant';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { UrlDto } from '../models/short-url.model-type';

const CONTROLLER_NAME = ControllerNames.UrlShortener as const;
const CONTROLLER_TAGS = [CONTROLLER_NAME] as const;
@Controller(CONTROLLER_NAME)
@ApiTags(...CONTROLLER_TAGS)
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}
  // #region Shorten URL ---------------------------------------------------------------------------------------------------------------------
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Shortened URL created successfully', type: UrlDto })
  @Post('/shorten')
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
  @ApiResponse({ status: HttpStatus.OK, description: 'Original URL found', type: UrlDto })
  @Get('/info/:shortUrl')
  async getOriginalUrl(@Param('shortUrl') shortUrl: string) {
    const url = await this.urlShortenerService.checkUrlExists(null, shortUrl, null);
    return url;
  }
  // #region Delete Short URL -----------------------------------------------------------------------------------------------------------------
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Short URL deleted successfully' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('/delete/:shortUrl')
  async deleteShortUrl(@Param('shortUrl') shortUrl: string) {
    await this.urlShortenerService.deleteUrlProcess(shortUrl);
    return { message: `Short URL ${shortUrl} was deleted successfully` };
  }
  // #region Get URL Usage Stats -----------------------------------------------------------------------------------------------------------
  @ApiResponse({ status: HttpStatus.OK, description: 'URL usage stats found', type: UrlDto })
  @Get('/analytics/:shortUrl')
  async getUsageStats(@Param('shortUrl') shortUrl: string) {
    const url = await this.urlShortenerService.checkUrlExists(null, shortUrl, null);
    return url;
  }
  // #region Get All URLs --------------------------------------------------------------------------------------------------------------------
  @ApiResponse({ status: HttpStatus.OK, description: 'All URLs found', type: UrlDto, isArray: true })
  @ApiQuery({ ...ListUrlsDtoQuery.id })
  @ApiQuery({ ...ListUrlsDtoQuery.shortUrl })
  @ApiQuery({ ...ListUrlsDtoQuery.originalUrl })
  @ApiQuery({ ...ListUrlsDtoQuery.validUntilStart })
  @ApiQuery({ ...ListUrlsDtoQuery.validUntilEnd })
  @ApiQuery({ ...ListUrlsDtoQuery.usageCountStart })
  @ApiQuery({ ...ListUrlsDtoQuery.usageCountEnd })
  @ApiQuery({ ...ListUrlsDtoQuery.ipAddress })
  @ApiQuery({ ...ListUrlsDtoQuery.createdAtStart })
  @ApiQuery({ ...ListUrlsDtoQuery.createdAtEnd })
  @ApiQuery({ ...ListUrlsDtoQuery.page })
  @ApiQuery({ ...ListUrlsDtoQuery.pageSize })
  @Get()
  async listUrls(@Query(new ZodValidationPipe(listUrlsValidationSchema)) query: ListUrlsDto) {
    const queryData = query;
    const urls = await this.urlShortenerService.listUrlsProcess(queryData);
    return urls;
  }
}
