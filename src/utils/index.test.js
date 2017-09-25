const { removeComments } = require('./');

describe('Utils', () => {
  describe('.removeComments', () => {
    it('returns given string when string does not contain any comments', () => {
      const str = 'hello world';
      expect(removeComments(str)).toEqual(str);
    });
    it('returns empty string when given a single line comment', () => {
      expect(removeComments('// hello world')).toEqual('');
    });
    it('returns empty string when given a multi line comment', () => {
      expect(
        removeComments(`/*
        hello world
        */`)
      ).toEqual('');
    });
    it('returns string without comments when given a string containing a singleline comment', () => {
      expect(removeComments('abc//hello world')).toEqual('abc');
    });
    it('returns string without comments when given a string containing a multi line comment', () => {
      expect(
        removeComments(`abc/*
        hello world
        */def`)
      ).toEqual('abcdef');
    });
    it('returns string without comments when given a string with both single and multi line comments', () => {
      expect(
        removeComments(`abc /* hello world */
        // foo
        /*
          bar
        */
        xyz
        /*
          baz
        */
        def // qux
        `).replace(/\s/g, '')
      ).toEqual('abcxyzdef');
    });
  });
});
