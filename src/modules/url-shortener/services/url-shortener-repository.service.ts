import { Inject, Injectable } from '@nestjs/common';
import { CONNECTION_POOL, DRIZZLE_POOL } from 'src/database/database.constant';
import { Pool } from 'pg';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Url } from '../models/short-url.model-type';
import { query } from 'express';
import { TABLE_NAMES } from 'src/common/constants/tables.constant';
import { CustomError } from 'src/common/errors/custom_error';
import { CreateUrlData } from '../types/url-shortener-repository.types';
import { ListUrlsDto } from '../dtos/url-shortener.dto';

@Injectable()
export class UrlShortenerRepositoryService {
  constructor(
    @Inject(CONNECTION_POOL) private readonly pg: Pool,
    @Inject(DRIZZLE_POOL) private readonly drizzle: NodePgDatabase,
  ) {}
  // #region Short URL -------------------------------------------------------------------------------------------------------------------------
  async getShortUrl(id: number | null, shortUrl: string | null, originalUrl: string | null) {
    if (id === null && shortUrl === null && originalUrl === null) {
      throw new CustomError('Either id, original Url or short Url must be provided', 400, 'Validation error');
    }
    let query = `SELECT * FROM ${TABLE_NAMES.URLS} WHERE 1 = 1`;
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
  // #region Create Short URL -----------------------------------------------------------------------------------------------------------------
  async createShortUrl(data: CreateUrlData) {
    let query = `INSERT INTO ${TABLE_NAMES.URLS}`;
    let index = 1;
    let queryCols: string[] = [];
    let queryVals: string[] = [];
    const vals: any[] = [];
    if (data.short_url) {
      queryCols.push('short_url');
      queryVals.push(`$${index}`);
      vals.push(data.short_url);
      index++;
    }
    if (data.original_url) {
      queryCols.push('original_url');
      queryVals.push(`$${index}`);
      vals.push(data.original_url);
      index++;
    }
    if (data.valid_until) {
      queryCols.push('valid_until');
      queryVals.push(`$${index}`);
      vals.push(data.valid_until);
      index++;
    }
    if (data.created_at) {
      queryCols.push('created_at');
      queryVals.push(`$${index}`);
      vals.push(data.created_at);
      index++;
    }
    query += `(${queryCols.join(', ')}) VALUES (${queryVals.join(', ')}) RETURNING *`;
    const result = await this.pg.query(query, vals);
    return result.rows[0] as Url;
  }
  // #region Update Short URL -----------------------------------------------------------------------------------------------------------------
  async updateShortUrl(id: number, data: Partial<Url>) {
    let query = `UPDATE ${TABLE_NAMES.URLS} SET`;
    let index = 1;
    let queryCols: string[] = [];
    const vals: any[] = [];
    if (data.short_url) {
      queryCols.push(`short_url = $${index}`);
      vals.push(data.short_url);
      index++;
    }
    if (data.original_url) {
      queryCols.push(`original_url = $${index}`);
      vals.push(data.original_url);
      index++;
    }
    if (data.usage_count) {
      queryCols.push(`usage_count = $${index}`);
      vals.push(data.usage_count);
      index++;
    }
    if (data.ips) {
      queryCols.push(`ips = $${index}`);
      vals.push(JSON.stringify(data.ips));
      index++;
    }
    if (data.created_at) {
      queryCols.push(`created_at = $${index}`);
      vals.push(data.created_at);
      index++;
    }
    if (data.valid_until) {
      queryCols.push(`valid_until = $${index}`);
      vals.push(data.valid_until);
      index++;
    }
    query += ` ${queryCols.join(', ')} WHERE id = $${index} RETURNING *`;
    vals.push(id);
    const result = await this.pg.query(query, vals);
    return result.rows[0] as Url;
  }
  // #region Delete Short URL -----------------------------------------------------------------------------------------------------------------
  async deleteShortUrl(id: number) {
    let query = `DELETE FROM ${TABLE_NAMES.URLS} WHERE id = $1`;
    const result = await this.pg.query(query, [id]);
    return result;
  }
  // #region List URLs ------------------------------------------------------------------------------------------------------------------------
  async listUrls(data: ListUrlsDto) {
    let query = `SELECT * FROM ${TABLE_NAMES.URLS} WHERE 1=1`;
    const vals: any[] = [];
    let index = 1;
    if (data.id) {
      query += ` AND id = $${index}`;
      vals.push(data.id);
      index++;
    }
    if (data.shortUrl) {
      query += ` AND short_url = $${index}`;
      vals.push(data.shortUrl);
      index++;
    }
    if (data.originalUrl) {
      query += ` AND original_url = $${index}`;
      vals.push(data.originalUrl);
      index++;
    }
    if (data.usageCountStart) {
      query += ` AND usage_count >= $${index}`;
      vals.push(data.usageCountStart);
      index++;
    }
    if (data.usageCountEnd) {
      query += ` AND usage_count <= $${index}`;
      vals.push(data.usageCountEnd);
      index++;
    }
    if (data.createdAtStart) {
      query += ` AND created_at >= $${index}`;
      vals.push(data.createdAtStart);
      index++;
    }
    if (data.createdAtEnd) {
      query += ` AND created_at <= $${index}`;
      vals.push(data.createdAtEnd);
      index++;
    }
    if (data.validUntilStart) {
      query += ` AND valid_until IS NOT NULL AND valid_until >= $${index}`;
      vals.push(data.validUntilStart);
      index++;
    }
    if (data.validUntilEnd) {
      query += ` AND valid_until IS NOT NULL AND valid_until <= $${index}`;
      vals.push(data.validUntilEnd);
      index++;
    }
    if (data.ipAddress) {
      query += ` AND ips @> $${index}`;
      vals.push(`["${data.ipAddress}"]`);
      index++;
    }
    const result = await this.pg.query(query, vals);
    return result.rows as Url[];
  }
}
