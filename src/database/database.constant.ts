import { ConfigurableModuleBuilder } from '@nestjs/common';

export const CONNECTION_POOL = 'PG_POOL';
export const DRIZZLE_POOL = 'DRIZZLE_POOL';
export interface DatabaseOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
export const { ConfigurableModuleClass: ConfigurableDatabaseModule, MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS } =
  new ConfigurableModuleBuilder<DatabaseOptions>().setClassMethodName('forRoot').build();
