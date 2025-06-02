import { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';
import path from 'path';

const createRule = ESLintUtils.RuleCreator(() => '');

type MessageIds = 'noProcessEnvOutsideEnvTS';

export const noProcessEnvOutsideEnvTS = createRule<[], MessageIds>({
  name: 'no-process-env-outside-env-ts',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow usage of process.env outside src/config/env.ts',
    },
    schema: [],
    messages: {
      noProcessEnvOutsideEnvTS:
        'Usage of process.env is only allowed in src/config/env.ts',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename;
    const normalizedFilename = path.normalize(filename).replace(/\\/g, '/');
    const allowedFilePath = 'src/config/env.ts';

    return {
      MemberExpression(node: TSESTree.MemberExpression) {
        const isProcess =
          node.object.type === TSESTree.AST_NODE_TYPES.Identifier &&
          node.object.name === 'process';

        const isEnvProperty =
          (node.property.type === TSESTree.AST_NODE_TYPES.Identifier &&
            node.property.name === 'env') ||
          (node.property.type === TSESTree.AST_NODE_TYPES.Literal &&
            node.property.value === 'env');

        if (isProcess && isEnvProperty) {
          if (!normalizedFilename.endsWith(allowedFilePath)) {
            context.report({
              node,
              messageId: 'noProcessEnvOutsideEnvTS',
            });
          }
        }
      },
    };
  },
});
