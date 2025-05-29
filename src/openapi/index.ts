import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import packageJSON from '../../package.json';
// Import all registration files to ensure paths/schemas are registered
import './products';
import { registry } from './registry';
import { config } from '~/config/env';

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: `${config.logger.logLabel}`,
    version: packageJSON.version,
  },
  // servers: [{ url: 'http://localhost:3000' }],
});
