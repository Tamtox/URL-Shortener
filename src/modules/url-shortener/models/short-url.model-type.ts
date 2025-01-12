import { InferSelectModel } from 'drizzle-orm';
import { ApiProperty } from '@nestjs/swagger';
import { urls } from './short-url.model';

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
