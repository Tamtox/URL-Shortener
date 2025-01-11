import { TABLE_NAMES } from 'src/common/constants/tables.constant';
import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { ApiProperty } from '@nestjs/swagger';

export const urls = pgTable(TABLE_NAMES.URLS, {
  id: serial('id').notNull().primaryKey(),
  short_url: text('short_url').unique().notNull(),
  original_url: text('original_url').unique().notNull(),
  created_at: timestamp('created_at').defaultNow(),
  valid_until: timestamp('valid_until'),
});
export type Url = InferSelectModel<typeof urls>;
export const URL_COLS = Object.keys(urls) as readonly (keyof Url)[];

export class UrlDto {
  @ApiProperty({ type: 'number', description: 'Url Id' })
  id: number;
  @ApiProperty({ type: 'string', description: 'Short URL' })
  short_url: string;
  @ApiProperty({ type: 'string', description: 'Original URL' })
  original_url: string;
  @ApiProperty({ type: 'string', format: 'date-time', description: 'Url creation data' })
  created_at: Date;
  @ApiProperty({ type: 'string', format: 'date-time', description: 'Valid until date' })
  valid_until: Date;
}
