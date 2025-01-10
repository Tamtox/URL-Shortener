import { Injectable } from '@nestjs/common';
import { ShortenUrlDto } from '../dtos/url-shortener.dto';
import { CustomError } from 'src/common/errors/custom_error';
import * as crypto from 'crypto';

@Injectable()
export class UrlShortenerService {
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
  async shortenUrl(body: ShortenUrlDto) {}
  async useShortUrl(shortUrl: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', 404, 'Validation error');
    }
  }
  async getOriginalUrl(shortUrl: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', 404, 'Validation error');
    }
    return 'Get Original URL';
  }
  async deleteShortUrl(shortUrl: string) {
    if (!shortUrl) {
      throw new CustomError('Short URL is required', 404, 'Validation error');
    }
  }
}
