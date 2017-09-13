const looksLike = require('./utils/looks-like');

const inspect = (count, containsExpectAssertions, containsHasAssertions) => ({
  ExpressionStatement(path) {
    const isExpect = looksLike(path.node, { expression: { callee: { object: { callee: { name: 'expect' } } } } });
    const isAsyncExpect = looksLike(path.node, {
      expression: { argument: { callee: { object: { callee: { name: 'expect' } } } } }
    });
    const isExpectAssertions = looksLike(path.node, {
      expression: { callee: { object: { name: 'expect' }, property: { name: 'assertions' } } }
    });

    const isHasAssertions = looksLike(path.node, {
      expression: { callee: { object: { name: 'expect' }, property: { name: 'hasAssertions' } } }
    });

    if (isExpectAssertions) {
      containsExpectAssertions();
    }

    if (isHasAssertions) {
      containsHasAssertions();
    }

    if (isExpect || isAsyncExpect) {
      count();
    }
  },
  ArrowFunctionExpression(path) {
    const isExpect = looksLike(path.node, { body: { callee: { object: { callee: { name: 'expect' } } } } });
    const isAsyncExpect = looksLike(path.node, {
      body: { argument: { callee: { object: { callee: { name: 'expect' } } } } }
    });
    if (isExpect || isAsyncExpect) {
      count();
    }
  }
});

module.exports = function({ template }) {
  return {
    name: 'babel-assertions',
    visitor: {
      ExpressionStatement(path) {
        const isTestBlock = looksLike(path, {
          node: {
            expression: {
              callee: {
                type: 'Identifier',
                name: n => n === 'it' || n === 'test' || n === 'fit' || n === 'ftest'
              }
            }
          }
        });

        const isOnlyBlock = looksLike(path, {
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
              }
            }
          }
        });

        if (!isTestBlock && !isOnlyBlock) {
          return;
        }

        let count = 0;
        const countCb = () => count++;

        let containsExpectAssertions = false;
        const containsExpectAssertionsCb = () => (containsExpectAssertions = true);
        let containsHasAssertions = false;
        const containsHasAssertionsCb = () => (containsHasAssertions = true);

        path.traverse(inspect(countCb, containsExpectAssertionsCb, containsHasAssertionsCb));

        const args = path.node.expression.arguments[1].body.body;
        if (!containsHasAssertions) {
          const hasAssertions = template('expect.hasAssertions();')();
          args.unshift(hasAssertions);
        }

        if (count > 0 && !containsExpectAssertions) {
          const assertions = template(`expect.assertions(${count})`)();
          args.unshift(assertions);
        }
      }
    }
  };
};
