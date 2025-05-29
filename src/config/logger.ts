import { createLogger, format, transports } from 'winston';

import { config } from './env';

const { colorize, combine, label, metadata, printf, timestamp } = format;

type LogMethod = (message: string, meta?: Record<string, unknown>) => void;

type Logger = {
  error: LogMethod;
  warn: LogMethod;
  info: LogMethod;
  debug: LogMethod;
  http: LogMethod;
};

export const logger: Logger = createLogger({
  level: config.logger.logLevel,
  format: combine(
    colorize({ level: true }),
    label({ label: config.logger.logLabel }),
    metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    timestamp(),
    printf(({ timestamp, label, level, message, metadata }) => {
      const logMessageWithoutMetadata = `${String(timestamp)} [${String(label)}] ${String(level)}: ${String(message)}`;

      if (
        typeof metadata === 'object' &&
        metadata !== null &&
        Object.keys(metadata).length > 0
      ) {
        const metaRecord = metadata as Record<string, unknown>;

        const serializedMetadata = Object.keys(metaRecord).reduce(
          (acc: Record<string, unknown>, key) => {
            const value = metaRecord[key];

            if (value instanceof Error) {
              acc[key] = {
                name: value.name,
                message: value.message,
                stack: value.stack,
              };
            } else {
              acc[key] = value;
            }

            return acc;
          },
          {},
        );

        return `${logMessageWithoutMetadata} ${JSON.stringify(serializedMetadata)}`;
      }

      return logMessageWithoutMetadata;
    }),
  ),
  transports: [
    new transports.Console({
      silent: config.env === 'test',
    }),
  ],
});
