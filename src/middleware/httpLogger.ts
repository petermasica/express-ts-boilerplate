import chalk from 'chalk';
import { Request } from 'express';
import morgan from 'morgan';

import { config } from '~/config/env';
import { logger } from '~/config/logger';

morgan.token('colored-status', (_req, res) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);

  return chalk.white(status);
});

const morganFormat =
  ':method :url :colored-status :res[content-length] - :response-time ms';

export const httpLogger = morgan(morganFormat, {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
  skip: (req: Request, _res) =>
    config.logger.ignoredRoutes.some((route) =>
      req.originalUrl.startsWith(route),
    ),
});
