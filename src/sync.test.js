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
    'Does not modify code given an inline value for function body': {
      code: `
      describe('.add', () => {
        test('handles variables', noop);
        test('handles numbers', 1);
        test('handles booleans', true);
        test('handles objects', {});
        test('handles arrays', []);
        test('handles maps', new Map());
        test('handles sets', new Set());
        test('handles symbols', Symbol('x'));
        test('handles undefined', undefined);
        test('handles strings', 'hello');
        test('handles null', null);
      });
      `
    },
    'Does not modify code given an empty test placeholder': {
      code: `
      describe('.add', () => {
        test('returns 3 when given 2 and 1');
      });
      `
    },
    'Does not modify code given an empty ftest placeholder': {
      code: `
      describe('.add', () => {
        ftest('returns 3 when given 2 and 1');
      });
      `
    },
    'Does not modify code given an empty test.only placeholder': {
      code: `
      describe('.add', () => {
        test.only('returns 3 when given 2 and 1');
      });
      `
    },
    'Does not modify code given an empty it placeholder': {
      code: `
      describe('.add', () => {
        it('returns 3 when given 2 and 1');
      });
      `
    },
    'Does not modify code given an empty fit placeholder': {
      code: `
      describe('.add', () => {
        fit('returns 3 when given 2 and 1');
      });
      `
    },
    'Does not modify code given an empty it.only placeholder': {
      code: `
      describe('.add', () => {
        it.only('returns 3 when given 2 and 1');
      });
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
