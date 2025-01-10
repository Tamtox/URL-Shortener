import { TABLE_NAMES } from 'src/common/constants/tables.constant';
import { pgTable, text, timestamp, numeric, serial, jsonb } from 'drizzle-orm/pg-core';
import { sql, InferSelectModel } from 'drizzle-orm';
import { ApiProperty } from '@nestjs/swagger';
import { urls } from 'src/modules/url-shortener/models/short-url.model';

export const url_usage = pgTable(TABLE_NAMES.URLS, {
  id: serial('id').primaryKey(),
  url_id: text('url_id')
    .unique()
    .notNull()
    .references(() => urls.id, { onDelete: 'cascade' }),
  count: numeric('count').notNull(),
  ip_addresses: jsonb('ip_addresses').default(sql`'[]'::jsonb`),
  valid_until: timestamp('valid_until').notNull(),
});
export type UrlUsage = InferSelectModel<typeof url_usage>;
export const URL_USAGE_COLS = Object.keys(url_usage) as readonly (keyof UrlUsage)[];
