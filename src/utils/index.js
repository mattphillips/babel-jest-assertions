const generate = require('babel-generator').default;
const types = require('babel-types');

const EMPTY = '';
const SINGLE_LINE_COMMENT = /\/\/(.*)/g;
const MULTI_LINE_COMMENT = /\/\*([\s\S]*?)\*\//g;

const removeComments = code => code.replace(SINGLE_LINE_COMMENT, EMPTY).replace(MULTI_LINE_COMMENT, EMPTY);

const getExpectCount = code => (code.match(/expect\(/g) || []).length;

const getFunctionCode = fn => generate(fn.body).code;

const normaliseFunctionType = fn => {
  if (types.isCallExpression(fn.body)) {
    fn.body = types.blockStatement([types.returnStatement(fn.body)]);
  }
  return fn;
};

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

module.exports = {
  compose,
  getExpectCount,
  getFunctionCode,
  normaliseFunctionType,
  removeComments
};
