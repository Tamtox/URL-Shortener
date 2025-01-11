import { defineConfig } from 'drizzle-kit';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

const configService = new ConfigService();

export default defineConfig({
  schema: ['./src/**/*.model.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: configService.get('SUPABASE_POSTGRES_HOST') as unknown as string,
    port: configService.get('SUPABASE_POSTGRES_PORT') as unknown as number,
    user: configService.get('SUPABASE_POSTGRES_USER') as unknown as string,
    password: configService.get('SUPABASE_POSTGRES_PASSWORD') as unknown as string,
    database: configService.get('SUPABASE_POSTGRES_DB') as unknown as string,
    ssl: { rejectUnauthorized: false },
  },
});
