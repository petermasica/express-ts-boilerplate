import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';

import routes from '~/api/index';
import { errorHandler } from '~/middleware/error-handler';
import { httpLogger } from '~/middleware/http-logger';
import { notFoundHandler } from '~/middleware/not-found-handler';
import { openApiDocument } from '~/openapi/openapi-document';

export const app = express();

app.use(httpLogger);

// Parses application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parses application/json
app.use(bodyParser.json());

// Parses Cookie header
app.use(cookieParser('SECRET'));

// Attempts to compress response bodies for all
// requests that traverse through the middleware
app.use(compress());

// Secures app by setting various HTTP headers
app.use(helmet());

// Guards against clickjacking
app.use(helmet.frameguard({ action: 'deny' }));

app.get('/health-check', (_req, res) => {
  // throw new Error('Health check failed');
  res.sendStatus(httpStatus.OK);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Mounts routes to be exposed by nginx
app.use('/api', routes);

// Mounts route not found handler
// If no route is matched by now, it must be 404
app.use(notFoundHandler);

// Mounts global error handler
app.use(errorHandler);
