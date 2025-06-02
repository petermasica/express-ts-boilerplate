import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import packageJSON from '../../package.json';
import { registry } from './openapi-registry';
import '~/api/products/products.openapi';
import { config } from '~/config/env';

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: `${config.logger.logLabel}`,
    version: packageJSON.version,
  },
});
