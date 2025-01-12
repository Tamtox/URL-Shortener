import { TABLE_NAMES } from 'src/common/constants/tables.constant';
import { pgTable, text, timestamp, serial, jsonb, bigint, numeric } from 'drizzle-orm/pg-core';

export const urls = pgTable(TABLE_NAMES.URLS, {
  id: serial('id').notNull().primaryKey(),
  short_url: text('short_url').unique().notNull(),
  original_url: text('original_url').unique().notNull(),
  usage_count: numeric('usage_count').default('0').notNull(),
  ips: jsonb('ips').default([]).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  valid_until: timestamp('valid_until'),
});
