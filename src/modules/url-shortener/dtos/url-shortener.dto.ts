import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// #region Shorten URL ---------------------------------------------------------------------------------------------------------------------
export const shortenUrlValidationSchema = z.object(
  {
    url: z
      .string({
        invalid_type_error: 'Url must be a string',
        required_error: 'Url is required',
      })
      .url({
        message: 'Url must be a valid URL',
      }),
    validUntil: z
      .string({
        invalid_type_error: 'Valid until must be a string',
        required_error: 'Valid until is required',
      })
      .datetime({
        message: 'Valid until must be a valid date',
      })
      .optional(),
    alias: z
      .string({
        invalid_type_error: 'Alias must be a string',
        required_error: 'Alias is required',
      })
      .max(20, {
        message: 'Alias must be at most 20 characters long',
      })
      .optional(),
  },
  {
    invalid_type_error: 'Shorten URL body must be an object',
    required_error: 'Shorten URL body is required',
  },
);
export class ShortenUrlDto extends createZodDto(shortenUrlValidationSchema) {}
