const pluginTester = require('babel-plugin-tester');
const plugin = require('./');

pluginTester({
  plugin,
  tests: {
    'Does not modify code when not a test': {
      code: `
      const add = (a, b) => a + b;
      `
    },
    'Adds number of assertions and has assertions check when given one expect statement': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('returns 1 when given 0 and 1', () => {
          expect(add(0, 1)).toEqual(1);
        });
      });
      `
    },
    'Adds total number of assertions when given multiple expect statements': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('returns 1 when given 0 and 1', () => {
          expect(add(0, 1)).toEqual(1);
          expect(add(1, 0)).toEqual(1);
        });
      });
      `
    },
    'Adds total number of assertions when given multiple expect statements in nested if scope': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('returns 1 when given 0 and 1', () => {
          if (true) {
            expect(add(0, 1)).toEqual(1);
          } else if (false) {
            expect(add(1, 0)).toEqual(1);
          }
        });
      });
      `
    },
    'Does not add expect.assertions when expect.assertions is supplied': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('returns 1 when given 0 and 1', () => {
          expect.assertions(1);
          expect(add(0, 1)).toEqual(1);
        });
      });
      `
    },
    'Adds expect.assertions when expect.hasAssertions is supplied': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('returns 1 when given 0 and 1', () => {
          expect.hasAssertions();
          expect(add(0, 1)).toEqual(1);
        });
      });
      `
    },
    'Does not count commented out expect statements': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('returns 1 when given 0 and 1', () => {
          // expect(add(1, 2)).toEqual(3);
          expect(add(0, 1)).toEqual(1);

          /*
            expect(add(4, 5).toEqual(9));
          */

          const a = 1; // expect(a).toEqual(1);
          const b = 2; /* expect(b).toEqual(2); */

          expect(add(1, 0)).toEqual(1);
          /*
            expect(add(6, 1).toEqual(7));
            */
        });
      });
      `
    },
    'Handles expression functions': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('returns 1 when given 0 and 1', () =>
          expect(add(1, 0)).toEqual(1));
      });
      `
    }
  }
});
