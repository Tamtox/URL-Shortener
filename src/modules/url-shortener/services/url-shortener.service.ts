import { HttpStatus, Injectable } from '@nestjs/common';
import { ShortenUrlDto } from '../dtos/url-shortener.dto';
import { CustomError } from 'src/common/errors/custom_error';
import * as crypto from 'crypto';
import { UrlShortenerRepositoryService } from './url-shortener-repository.service';
import { CreateUrlData } from '../types/url-shortener-repository.types';

@Injectable()
export class UrlShortenerService {
  constructor(private readonly urlShortenerRepositoryService: UrlShortenerRepositoryService) {}
  // #region Check URL Exists ---------------------------------------------------------------------------------------------------------------
  async checkUrlExists(id: number | null, shortUrl: string | null, originalUrl: string | null) {
    if (id === null && shortUrl === null) {
      throw new CustomError('Either id or shortUrl must be provided', HttpStatus.BAD_REQUEST, 'Validation error');
    }
    const url = await this.urlShortenerRepositoryService.getShortUrl(id, shortUrl, originalUrl);
    if (!url) {
      throw new CustomError('URL not found', HttpStatus.NOT_FOUND, 'Not found');
    }
    return url;
  }
  // #region Generate Short URL --------------------------------------------------------------------------------------------------------------
  async generateShortUrl() {
    const baseUrl = 'short.url-';
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
      shortUrl = `short.url-${body.alias}`;
      const existingShortUrl = await this.urlShortenerRepositoryService.getShortUrl(null, shortUrl, null);
      if (existingShortUrl) {
        throw new CustomError('Short URL already exists', HttpStatus.BAD_REQUEST, 'Validation error');
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
      usage_count: '0',
      ips: [],
    };
    if (body.validUntil) {
      data.valid_until = new Date(body.validUntil);
    }
    const newUrl = await this.urlShortenerRepositoryService.createShortUrl(data);
    return newUrl;
  }
  // #region Use Short URL ------------------------------------------------------------------------------------------------------------------
  async useShortUrlProcess(shortUrl: string, ipAddress: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', HttpStatus.BAD_REQUEST, 'Validation error');
    }
    const url = await this.checkUrlExists(null, shortUrl, null);
    const validUntil = url.valid_until;
    if (validUntil !== null) {
      const now = new Date();
      if (now.getTime() >= new Date(validUntil).getTime()) {
        throw new CustomError('Short URL has expired', HttpStatus.GONE, 'Validation error');
      }
    }
    const ips = url.ips as string[];
    if (ips.length >= 5) {
      ips.shift();
    }
    ips.push(ipAddress);
    const updatedUrlData = {
      usage_count: String(BigInt(url.usage_count) + BigInt(1)),
      ips,
    };
    const updatedUrl = await this.urlShortenerRepositoryService.updateShortUrl(url.id, updatedUrlData);
    return url;
  }
  // #region Delete URL ---------------------------------------------------------------------------------------------------------------------
  async deleteUrlProcess(shortUrl: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', HttpStatus.BAD_REQUEST, 'Validation error');
    }
    const url = await this.urlShortenerRepositoryService.getShortUrl(null, shortUrl, null);
    if (!url) {
      throw new CustomError('URL not found', HttpStatus.NOT_FOUND, 'Not found');
    }
    await this.urlShortenerRepositoryService.deleteShortUrl(url.id);
    return;
  }
}
