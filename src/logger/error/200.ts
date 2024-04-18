import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LoggerService } from '../logger.service';

@Catch()
export class SuccessFilter extends BaseExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const message = `Success: ${request.method} ${request.url}`;

    // Log the successful request
    this.logger.log(message, 'SuccessFilter');

    super.catch(exception, host);
  }
}
