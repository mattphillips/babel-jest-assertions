const { isOnlyBlock, isTestBlock } = require('./identifer');
const { compose, getExpectCount, getFunctionCode, normaliseFunctionType, removeComments } = require('./utils');
const getHooksCount = require('./hooks');

module.exports = ({ template }) => {
  return {
    name: 'babel-assertions',
    visitor: {
      ExpressionStatement(path) {
        if (!isTestBlock(path) && !isOnlyBlock(path)) return;

        const hookCount = getHooksCount(path, 0);

        const testFunction = normaliseFunctionType(path.node.expression.arguments[1]);
        const normalisedCode = compose(removeComments, getFunctionCode)(testFunction);
        const count = getExpectCount(normalisedCode) + hookCount;

        const containsExpectAssertions = normalisedCode.includes('expect.assertions(');
        const containsHasAssertions = normalisedCode.includes('expect.hasAssertions()');

        const body = testFunction.body.body;

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
