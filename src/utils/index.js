const EMPTY = '';
const SINGLE_LINE_COMMENT = /\/\/(.*)/g;
const MULTI_LINE_COMMENT = /\/\*([\s\S]*?)\*\//g;

const removeComments = code => code.replace(SINGLE_LINE_COMMENT, EMPTY).replace(MULTI_LINE_COMMENT, EMPTY);

module.exports = {
  removeComments
};
