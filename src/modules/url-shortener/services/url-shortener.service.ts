import { Injectable } from '@nestjs/common';
import { ShortenUrlDto } from '../dtos/url-shortener.dto';
import { CustomError } from 'src/common/errors/custom_error';
import * as crypto from 'crypto';
import { UrlShortenerRepositoryService } from './url-shortener-repository.service';

@Injectable()
export class UrlShortenerService {
  constructor(private readonly urlShortenerRepositoryService: UrlShortenerRepositoryService) {}
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
  async shortenUrl(body: ShortenUrlDto) {
    const existingUrl = await this.urlShortenerRepositoryService.getShortUrl(null, null, body.url);
    if (existingUrl) {
      return existingUrl;
    }
  }
  async useShortUrl(shortUrl: string, ipAddress: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', 404, 'Validation error');
    }
    const url = await this.checkUrlExists(null, shortUrl, null);
    return url;
  }
  async getOriginalUrl(shortUrl: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', 404, 'Validation error');
    }
    const url = await this.urlShortenerRepositoryService.getShortUrl(null, shortUrl, null);
    return url;
  }
  async deleteShortUrl(shortUrl: string) {
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
  async getUsageStats(shortUrl: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', 404, 'Validation error');
    }
    const url = await this.checkUrlExists(null, shortUrl, null);
    return url;
  }
}
