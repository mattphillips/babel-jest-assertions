const looksLike = require('./utils/looks-like');

module.exports = function({ template, transformFromAst, types }) {
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

        const { code } = transformFromAst(types.Program([path.node]));
        const normalisedCode = code.replace(/\/\/(.*)/g, '').replace(/\/\*([\s\S]*)\*\//g, '');

        const count = (normalisedCode.match(/expect\(/g) || []).length;
        const containsExpectAssertions = normalisedCode.includes('expect.assertions(');
        const containsHasAssertions = normalisedCode.includes('expect.hasAssertions()');

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
