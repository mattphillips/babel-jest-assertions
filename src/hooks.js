const types = require('babel-types');
const { isDescribeBlock, isHookBlock } = require('./identifer');
const { compose, getExpectCount, getFunctionCode, normaliseFunctionType, removeComments } = require('./utils');

const getFunctionCount = compose(getExpectCount, removeComments, getFunctionCode, normaliseFunctionType);

const accumulateHookCount = (acc, hook) =>
  isHookBlock(hook) ? acc + getFunctionCount(hook.expression.arguments[0]) : acc;

const getHooksCount = (path, count) => {
  if (types.isProgram(path)) {
    return path.node.body.reduce(accumulateHookCount, count);
  }

  if (isDescribeBlock(path)) {
    return getHooksCount(
      path.parentPath,
      path.node.expression.arguments[1].body.body.reduce(accumulateHookCount, count)
    );
  }

  return getHooksCount(path.parentPath, count);
};

module.exports = getHooksCount;
