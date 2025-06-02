export default {
  singleQuote: true,
  importOrder: ['<THIRD_PARTY_MODULES>', '^[./|~]'],
  importOrderCaseInsensitive: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
