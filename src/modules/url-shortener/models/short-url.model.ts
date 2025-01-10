import { TABLE_NAMES } from 'src/common/constants/tables.constant';
import { pgTable, text, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';
import { sql, InferSelectModel } from 'drizzle-orm';
import { ApiProperty } from '@nestjs/swagger';

export const urls = pgTable(TABLE_NAMES.URLS, {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  short_url: text('short_url').unique().notNull(),
  original_url: text('original_url').unique().notNull(),
  created_at: timestamp('created_at').defaultNow(),
  valid_until: timestamp('valid_until').notNull(),
});
export type Url = InferSelectModel<typeof urls>;
export const URL_COLS = Object.keys(urls) as readonly (keyof Url)[];
