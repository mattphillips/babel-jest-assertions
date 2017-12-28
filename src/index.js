const { isOnlyBlock, isTestBlock } = require('./identifer');
const { getExpectCount, getFunctionCode, normaliseFunctionType, removeComments } = require('./utils');

module.exports = ({ template }) => {
  return {
    name: 'babel-assertions',
    visitor: {
      ExpressionStatement(path) {
        if (!isTestBlock(path) && !isOnlyBlock(path)) return;

        const testFunction = normaliseFunctionType(path.node.expression.arguments[1]);
        const code = getFunctionCode(testFunction);
        const normalisedCode = removeComments(code);
        const count = getExpectCount(normalisedCode);

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
