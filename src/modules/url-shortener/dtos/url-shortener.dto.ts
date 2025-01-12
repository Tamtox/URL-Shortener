import { createZodDto } from 'nestjs-zod';
import { zodStringToNumberPreprocessor } from 'src/common/validation/preprocessors';
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

// # region List URLs ---------------------------------------------------------------------------------------------------------------------
export const listUrlsValidationSchema = z.object(
  {
    id: z
      .preprocess(
        zodStringToNumberPreprocessor,
        z.number({
          invalid_type_error: 'ID must be a number',
        }),
      )
      .optional(),
    shortUrl: z
      .string({
        invalid_type_error: 'Short URL must be a string',
      })
      .optional(),
    originalUrl: z
      .string({
        invalid_type_error: 'Original URL must be a string',
      })
      .optional(),
    usageCountStart: z
      .preprocess(
        zodStringToNumberPreprocessor,
        z.number({
          invalid_type_error: 'Usage count start must be a number',
        }),
      )
      .optional(),
    usageCountEnd: z
      .preprocess(
        zodStringToNumberPreprocessor,
        z.number({
          invalid_type_error: 'Usage count end must be a number',
        }),
      )
      .optional(),
    ipAddress: z
      .string({
        invalid_type_error: 'IP address must be a string',
      })
      .ip({
        message: 'IP address must be a valid IP address',
      })
      .optional(),
    validUntilStart: z
      .string({
        invalid_type_error: 'Valid until start must be a string',
      })
      .datetime({
        message: 'Valid until start must be a valid date',
      })
      .optional(),
    validUntilEnd: z
      .string({
        invalid_type_error: 'Valid until end must be a string',
      })
      .datetime({
        message: 'Valid until end must be a valid date',
      })
      .optional(),
    createdAtStart: z
      .string({
        invalid_type_error: 'Created at start must be a string',
      })
      .datetime({
        message: 'Created at start must be a valid date',
      })
      .optional(),
    createdAtEnd: z
      .string({
        invalid_type_error: 'Created at end must be a string',
      })
      .datetime({
        message: 'Created at end must be a valid date',
      })
      .optional(),
  },
  {
    invalid_type_error: 'Shorten URL body must be an object',
    required_error: 'Shorten URL body is required',
  },
);
export class ListUrlsDto extends createZodDto(listUrlsValidationSchema) {}
