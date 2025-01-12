import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { z } from 'zod';
import { CustomError } from './custom_error';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const responseBody: {
      statusCode: number;
      message?: string;
      type: string;
      timestamp: string;
      details?: any;
    } = {
      statusCode: exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      type: exception instanceof HttpException ? exception.getResponse()['error'] : 'Internal server error',
      message: exception instanceof HttpException ? exception.getResponse()['message'] : 'Internal server error',
      timestamp: new Date().toISOString(),
    };
    if (exception instanceof z.ZodError) {
      // Validation error
      const errors = exception.errors;
      responseBody.details = {
        errors: errors,
      };
      responseBody.statusCode = HttpStatus.BAD_REQUEST;
      responseBody.type = 'Validation error';
      let index = 0;
      let message = '';
      while (index < errors.length) {
        message += errors[index].message;
        index++;
      }
      responseBody.message = message;
    } else if (exception instanceof CustomError) {
      // Custom error
      responseBody.message = exception.message;
      responseBody.statusCode = exception.statusCode;
      responseBody.type = exception.type;
    }
    response.status(responseBody.statusCode).json(responseBody);
  }
}
