const generate = require('babel-generator').default;

const looksLike = require('./utils/looks-like');
const { removeComments } = require('./utils');

module.exports = function({ template, types }) {
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

        // get the test case body
        let body = path.node.expression.arguments[1].body;

        // if it's an expression, e.g: () => (expression)
        if (types.isCallExpression(body)) {
          // convert it into a block statement: () => { return (expression); }
          body = path.node.expression.arguments[1].body = types.blockStatement([types.returnStatement(body)]);
        }

        // generate the code
        const { code } = generate(body);
        const normalisedCode = removeComments(code);

        const count = (normalisedCode.match(/expect\(/g) || []).length;
        const containsExpectAssertions = normalisedCode.includes('expect.assertions(');
        const containsHasAssertions = normalisedCode.includes('expect.hasAssertions()');

        const args = body.body;

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
