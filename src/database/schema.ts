import { url_usage } from 'src/modules/url-shortener/models/url-usage.model';
import { urls } from 'src/modules/url-shortener/models/short-url.model';

export const databaseSchema = {
  ...urls,
  ...url_usage,
};
