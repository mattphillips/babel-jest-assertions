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
    'Adds expect.assertions(1) and ignores commented out expects': {
      code: `
      describe('.add', () => {
        it('returns 2 when given 1 and 1', () => {
          /*
            expect(1).toBe(1);
          */
          const a = 1; /* expect(a).toBe(1) */
          const b = 1; // expect(b).toBe(1)
          expect(add(a, b)).toBe(2);
          // expect (add(1, 2)).toBe(3);
        });
      });
      `,
      output: `
      describe('.add', () => {
        it('returns 2 when given 1 and 1', () => {
          expect.hasAssertions();
          expect.assertions(1);
          /*
            expect(1).toBe(1);
          */
          const a = 1; /* expect(a).toBe(1) */
          const b = 1; // expect(b).toBe(1)
          expect(add(a, b)).toBe(2);
          // expect (add(1, 2)).toBe(3);
        });
      });
      `
    }
  }
});
