export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LoggerOptions {
  level: LogLevel;
}

class Logger {
  private level: LogLevel;

  constructor(options?: LoggerOptions) {
    this.level = options?.level || LogLevel.INFO;
  }

  private shouldLog(logLevel: LogLevel): boolean {
    const levels: LogLevel[] = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(logLevel);

    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, optionalParams?: any[]) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${
      optionalParams && optionalParams.length > 0 ? JSON.stringify(optionalParams) : ''
    }`;
  }

  public debug(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, optionalParams));
    }
  }

  public info(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, optionalParams));
    }
  }

  public warn(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, optionalParams));
    }
  }

  public error(message: string, ...optionalParams: any[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, message, optionalParams));
    }
  }

  public setLogLevel(level: LogLevel) {
    this.level = level;
  }
}

const logger = new Logger({
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
});

export default logger;
