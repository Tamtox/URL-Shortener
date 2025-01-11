import { Inject, Injectable } from '@nestjs/common';
import { CONNECTION_POOL, DRIZZLE_POOL } from 'src/database/database.constant';
import { Pool } from 'pg';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Url } from '../models/short-url.model';
import { query } from 'express';
import { TABLE_NAMES } from 'src/common/constants/tables.constant';
import { CustomError } from 'src/common/errors/custom_error';
import { UrlUsage } from '../models/url-usage.model';
import { CreateUrlData, CreateUrlUsageData } from '../types/url-shotener-repository.types';

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
  async createUsageStats(data: CreateUrlUsageData) {
    let query = `INSERT INTO ${TABLE_NAMES.USAGES}`;
    let index = 1;
    let queryCols: string[] = [];
    let queryVals: string[] = [];
    const vals: any[] = [];
    if (data.url_id) {
      queryCols.push('url_id');
      queryVals.push(`$${index}`);
      vals.push(data.url_id);
      index++;
    }
    if (data.count) {
      queryCols.push('count');
      queryVals.push(`$${index}`);
      vals.push(data.count);
      index++;
    }
    if (data.ip_addresses) {
      queryCols.push('ip_addresses');
      queryVals.push(`$${index}`);
      vals.push(data.ip_addresses);
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
    return result.rows[0] as UrlUsage;
  }
}
