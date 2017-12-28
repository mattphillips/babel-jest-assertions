const looksLike = require('./utils/looks-like');

const hasBodyFunction = args =>
  looksLike(args[1], {
    type: t => t === 'ArrowFunctionExpression' || t === 'FunctionExpression'
  });

const isTestBlock = path =>
  looksLike(path, {
    node: {
      expression: {
        callee: {
          type: 'Identifier',
          name: n => n === 'it' || n === 'test' || n === 'fit' || n === 'ftest'
        },
        arguments: hasBodyFunction
      }
    }
  });

const isOnlyBlock = path =>
  looksLike(path, {
    node: {
      expression: {
        callee: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: n => n === 'it' || n === 'test'
          },
          property: {
            type: 'Identifier',
            name: 'only'
          }
        },
        arguments: hasBodyFunction
      }
    }
  });

module.exports = { isOnlyBlock, isTestBlock };
