import { Injectable } from '@nestjs/common';
import { ShortenUrlDto } from '../dtos/url-shortener.dto';
import { CustomError } from 'src/common/errors/custom_error';
import * as crypto from 'crypto';
import { UrlShortenerRepositoryService } from './url-shortener-repository.service';
import { CreateUrlData, CreateUrlUsageData } from '../types/url-shotener-repository.types';

@Injectable()
export class UrlShortenerService {
  constructor(private readonly urlShortenerRepositoryService: UrlShortenerRepositoryService) {}
  // #region Check URL Exists ---------------------------------------------------------------------------------------------------------------
  async checkUrlExists(id: number | null, shortUrl: string | null, originalUrl: string | null) {
    if (id === null && shortUrl === null) {
      throw new CustomError('Either id or shortUrl must be provided', 400, 'Validation error');
    }
    const url = await this.urlShortenerRepositoryService.getShortUrl(id, shortUrl, originalUrl);
    if (!url) {
      throw new CustomError('URL not found', 404, 'Not found');
    }
    return url;
  }
  async checkUrlUsageExists(id: number | null, urlId: number | null) {
    if (id === null && urlId === null) {
      throw new CustomError('Either id or urlId must be provided', 400, 'Validation error');
    }
    const usage = await this.urlShortenerRepositoryService.getUsageStats(id, urlId);
    if (!usage) {
      throw new CustomError('URL usage not found', 404, 'Not found');
    }
    return usage;
  }
  // #region Generate Short URL --------------------------------------------------------------------------------------------------------------
  async generateShortUrl() {
    const baseUrl = 'http://short.url/';
    // Generate 6 character string from incoming hash
    const uuid = crypto.randomUUID();
    let hash = '';
    let base = 1;
    let index = base;
    while (hash.length < 6) {
      hash += uuid[index - 1];
      index *= 2;
      if (index >= uuid.length) {
        base++;
        index = base;
      }
    }
    // Take first 6 characters
    return `${baseUrl}${hash}`;
  }
  // #region Create URL ---------------------------------------------------------------------------------------------------------------------
  async createUrlProcess(body: ShortenUrlDto) {
    const existingUrl = await this.urlShortenerRepositoryService.getShortUrl(null, null, body.url);
    if (existingUrl) {
      return existingUrl;
    }
    let shortUrl: string;
    if (body.alias) {
      shortUrl = `http://short.url/${body.alias}`;
      const existingShortUrl = await this.urlShortenerRepositoryService.getShortUrl(null, shortUrl, null);
      if (existingShortUrl) {
        throw new CustomError('Short URL already exists', 400, 'Validation error');
      }
    } else {
      shortUrl = await this.generateShortUrl();
      let isUnique = false;
      while (!isUnique) {
        const existingShortUrl = await this.urlShortenerRepositoryService.getShortUrl(null, shortUrl, null);
        if (!existingShortUrl) {
          isUnique = true;
        } else {
          shortUrl = await this.generateShortUrl();
        }
      }
    }
    const data: CreateUrlData = {
      original_url: body.url,
      short_url: shortUrl,
    };
    if (body.validUntil) {
      data.valid_until = body.validUntil;
    }
    const newUrl = await this.urlShortenerRepositoryService.createShortUrl(data);
    return newUrl;
  }
  // #region Use Short URL ------------------------------------------------------------------------------------------------------------------
  async useShortUrlProcess(shortUrl: string, ipAddress: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', 404, 'Validation error');
    }
    const url = await this.checkUrlExists(null, shortUrl, null);
    // let usage = await this.urlShortenerRepositoryService.getUsageStats(null, url.id);
    // if (!usage) {
    //   const data: CreateUrlUsageData = {
    //     count: 1,
    //     ip_addresses: [ipAddress],
    //     url_id: url.id,
    //   };
    //   usage = await this.urlShortenerRepositoryService.createUsageStats(data);
    // } else {
    // }
    return url;
  }
  // #region Delete URL ---------------------------------------------------------------------------------------------------------------------
  async deleteUrlProcess(shortUrl: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', 404, 'Validation error');
    }
    const url = await this.urlShortenerRepositoryService.getShortUrl(null, shortUrl, null);
    if (!url) {
      throw new CustomError('URL not found', 404, 'Not found');
    }
    await this.urlShortenerRepositoryService.deleteShortUrl(url.id);
    return;
  }
  // #region Get URL Usage Stats -------------------------------------------------------------------------------------------------------------
  async getUsageStatsProcess(shortUrl: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', 404, 'Validation error');
    }
    const url = await this.checkUrlExists(null, shortUrl, null);
    const usage = await this.checkUrlUsageExists(null, url.id);
    return { url, usage };
  }
}
