import { ConsoleLogger } from '@nestjs/common';

export class NestLogger {
  private logger: ConsoleLogger;

  constructor() {
    this.logger = new ConsoleLogger();
  }

  public log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  public error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  public warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  public debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  public verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
  }
}
