const EMPTY = '';
const SINGLE_LINE_COMMENT = /\/\/(.*)/g;
const MULTI_LINE_COMMENT = /\/\*([\s\S]*?)\*\//g;

const removeComments = code => code.replace(SINGLE_LINE_COMMENT, EMPTY).replace(MULTI_LINE_COMMENT, EMPTY);

const getExpectCount = code => (code.match(/expect\(/g) || []).length;

module.exports = {
  getExpectCount,
  removeComments
};
