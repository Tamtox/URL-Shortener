import { Url } from '../models/short-url.model-type';

export type CreateUrlData = Omit<Url, 'id' | 'created_at' | 'valid_until'> &
  Partial<Pick<Url, 'id' | 'created_at' | 'valid_until'>>;

export type UpdateUserData = Pick<Url, 'id'> & Partial<Url>;
