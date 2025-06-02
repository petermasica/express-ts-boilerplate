/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

export default {
  '*': ['npm run format'],
  '*.{js,ts}': ['npm run lint'],
};
