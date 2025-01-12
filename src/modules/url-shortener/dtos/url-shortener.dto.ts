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
    page: z.preprocess(
      zodStringToNumberPreprocessor,
      z
        .number({
          invalid_type_error: 'Page must be a number',
        })
        .min(1, {
          message: 'Page must be at least 1',
        }),
    ),
    pageSize: z.preprocess(
      zodStringToNumberPreprocessor,
      z
        .number({
          invalid_type_error: 'Page size must be a number',
        })
        .min(1, {
          message: 'Page size must be at least 1',
        }),
    ),
  },
  {
    invalid_type_error: 'Shorten URL body must be an object',
    required_error: 'Shorten URL body is required',
  },
);
export class ListUrlsDto extends createZodDto(listUrlsValidationSchema) {}
export const ListUrlsDtoQuery = {
  id: {
    name: 'id',
    type: 'number',
    required: false,
  },
  shortUrl: {
    name: 'shortUrl',
    type: 'string',
    required: false,
  },
  originalUrl: {
    name: 'originalUrl',
    type: 'string',
    required: false,
  },
  usageCountStart: {
    name: 'usageCountStart',
    type: 'number',
    required: false,
  },
  usageCountEnd: {
    name: 'usageCountEnd',
    type: 'number',
    required: false,
  },
  ipAddress: {
    name: 'ipAddress',
    type: 'string',
    required: false,
  },
  validUntilStart: {
    name: 'validUntilStart',
    type: 'string',
    required: false,
  },
  validUntilEnd: {
    name: 'validUntilEnd',
    type: 'string',
    required: false,
  },
  createdAtStart: {
    name: 'createdAtStart',
    type: 'string',
    required: false,
  },
  createdAtEnd: {
    name: 'createdAtEnd',
    type: 'string',
    required: false,
  },
  page: {
    name: 'page',
    type: 'number',
    required: true,
  },
  pageSize: {
    name: 'pageSize',
    type: 'number',
    required: true,
  },
};
