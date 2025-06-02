import { getClient, getDb, initDbConnection } from '~/config/db';
import { logger } from '~/config/logger';

(async () => {
  await initDbConnection();
  await getDb().dropDatabase();
})().catch((error) => {
  logger.error('Error during test setup:', { error });
  process.exit(1);
});

afterEach(async () => {
  await getDb().dropDatabase();
});

afterAll(async () => {
  await getClient().close();
});
