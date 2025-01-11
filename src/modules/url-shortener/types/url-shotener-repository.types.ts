import { Url } from '../models/short-url.model';
import { UrlUsage } from '../models/url-usage.model';

export type CreateUrlData = Omit<Url, 'id' | 'created_at' | 'valid_until'> &
  Partial<Pick<Url, 'id' | 'created_at' | 'valid_until'>>;

export type UpdateUserData = Pick<Url, 'id'> & Partial<Url>;

export type CreateUrlUsageData = Omit<UrlUsage, 'id' | 'created_at'> & Partial<Pick<UrlUsage, 'id' | 'created_at'>>;

export type UpdateUrlUsageData = Pick<UrlUsage, 'id'> & Partial<UrlUsage>;
