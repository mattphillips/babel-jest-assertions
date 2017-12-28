const generate = require('babel-generator').default;

const { isOnlyBlock, isTestBlock } = require('./identifer');
const { removeComments } = require('./utils');

module.exports = ({ template, types }) => {
  return {
    name: 'babel-assertions',
    visitor: {
      ExpressionStatement(path) {
        if (!isTestBlock(path) && !isOnlyBlock(path)) return;

        const test = path.node.expression.arguments[1];

        if (types.isCallExpression(test.body)) {
          test.body = types.blockStatement([types.returnStatement(test.body)]);
        }

        const { code } = generate(test.body);
        const normalisedCode = removeComments(code);

        const count = (normalisedCode.match(/expect\(/g) || []).length;
        const containsExpectAssertions = normalisedCode.includes('expect.assertions(');
        const containsHasAssertions = normalisedCode.includes('expect.hasAssertions()');

        const body = test.body.body;

        if (!containsHasAssertions) {
          const hasAssertions = template('expect.hasAssertions();')();
          body.unshift(hasAssertions);
        }

        if (count > 0 && !containsExpectAssertions) {
          const assertions = template(`expect.assertions(${count})`)();
          body.unshift(assertions);
        }
      }
    }
  };
};
