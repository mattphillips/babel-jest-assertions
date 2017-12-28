const looksLike = require('./utils/looks-like');

const hasBodyFunction = index => args =>
  looksLike(args[index], {
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
        arguments: hasBodyFunction(1)
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
        arguments: hasBodyFunction(1)
      }
    }
  });

const isDescribeBlock = path =>
  looksLike(path, {
    node: {
      expression: {
        callee: {
          type: 'Identifier',
          name: 'describe'
        },
        arguments: hasBodyFunction(1)
      }
    }
  });

const isHookBlock = path =>
  looksLike(path, {
    expression: {
      callee: {
        type: 'Identifier',
        name: n => n === 'beforeEach' || n === 'afterEach'
      },
      arguments: hasBodyFunction(0)
    }
  });

module.exports = { isDescribeBlock, isHookBlock, isOnlyBlock, isTestBlock };
