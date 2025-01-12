import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { databaseSchema } from './schema';
import { ConfigService } from '@nestjs/config';
import { ConfigurableDatabaseModule, CONNECTION_POOL, DatabaseOptions, DRIZZLE_POOL } from './database.constant';

@Global()
@Module({
  providers: [
    // Pg options
    {
      provide: 'PG_OPTIONS',
      inject: [ConfigService],
      useFactory: (config) => {
        const databaseOptions = {
          host: config.get('POSTGRES_HOST'),
          port: config.get('POSTGRES_PORT'),
          user: config.get('POSTGRES_USER'),
          password: config.get('POSTGRES_PASSWORD'),
          database: config.get('POSTGRES_DB'),
        };
        return databaseOptions;
      },
    },
    // Pg connection pool
    {
      provide: CONNECTION_POOL,
      inject: ['PG_OPTIONS'],
      useFactory: (databaseOptions: DatabaseOptions) => {
        return new Pool({
          host: databaseOptions.host,
          port: databaseOptions.port,
          user: databaseOptions.user,
          password: databaseOptions.password,
          database: databaseOptions.database,
          // ssl: { rejectUnauthorized: false },
        });
      },
    },
    // Drizzle pool
    {
      provide: DRIZZLE_POOL,
      inject: [CONNECTION_POOL],
      useFactory: (pool: Pool) => {
        return drizzle(pool, { schema: databaseSchema });
      },
    },
  ],
  exports: [CONNECTION_POOL, DRIZZLE_POOL],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
