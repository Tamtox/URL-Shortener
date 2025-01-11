import { Inject, Injectable } from '@nestjs/common';
import { CONNECTION_POOL, DRIZZLE_POOL } from 'src/database/database.constant';
import { Pool } from 'pg';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Url } from '../models/short-url.model';
import { query } from 'express';
import { TABLE_NAMES } from 'src/common/constants/tables.constant';
import { CustomError } from 'src/common/errors/custom_error';
import { UrlUsage } from '../models/url-usage.model';

@Injectable()
export class UrlShortenerRepositoryService {
  constructor(
    @Inject(CONNECTION_POOL) private readonly pg: Pool,
    @Inject(DRIZZLE_POOL) private readonly drizzle: NodePgDatabase,
  ) {}
  async getShortUrl(id: number | null, shortUrl: string | null, originalUrl: string | null) {
    if (id === null && shortUrl === null && originalUrl === null) {
      throw new CustomError('Either id, original Url or short Url must be provided', 400, 'Validation error');
    }
    let query = `SELECT FROM ${TABLE_NAMES.URLS} WHERE 1 = 1`;
    const vals: any[] = [];
    let index = 1;
    if (id) {
      query += ` AND id = $${index}`;
      vals.push(id);
      index++;
    }
    if (shortUrl) {
      query += ` AND short_url = $${index}`;
      vals.push(shortUrl);
      index++;
    }
    if (originalUrl) {
      query += ` AND original_url = $${index}`;
      vals.push(originalUrl);
      index++;
    }
    const result = await this.pg.query(query, vals);
    let url: Url | null = null;
    if (result.rows.length > 0) {
      url = result.rows[0];
    }
    return url;
  }
  async deleteShortUrl(id: number) {
    let query = `DELETE FROM ${TABLE_NAMES.URLS} WHERE id = $1`;
    const result = await this.pg.query(query, [id]);
    return result;
  }
  async getUsageStats(id: number | null, urlId: number | null) {
    let query = `SELECT DISTINCT * FROM ${TABLE_NAMES.USAGES} WHERE 1 = 1`;
    let index = 1;
    const vals: any[] = [];
    if (id) {
      query += ` AND id = $${index}`;
      vals.push(id);
      index++;
    }
    if (urlId) {
      query += ` AND url_id = $${index}`;
      vals.push(urlId);
      index++;
    }
    const usage: UrlUsage | null = null;
    const result = await this.pg.query(query, vals);
    if (result.rows.length > 0) {
      return result.rows[0] as UrlUsage;
    }
    return usage;
  }
}
