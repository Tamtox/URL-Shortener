export const ERROR_IMPORTANCE = Array.from({ length: 10 }, (_, i) => i + 1);
export type ErrorImportance = (typeof ERROR_IMPORTANCE)[number];
export type CustomErrorType =
  | 'Internal server error'
  | 'Validation error'
  | 'Custom error'
  | 'Authorization error'
  | 'Authentication error'
  | 'Not found';
export class CustomError extends Error {
  statusCode: number;
  level: ErrorImportance;
  type: CustomErrorType;
  constructor(message: string, statusCode: number, type: CustomErrorType, level: ErrorImportance = 1) {
    super(message);
    this.statusCode = statusCode;
    this.level = level;
    this.type = type;
  }
}
