const pluginTester = require('babel-plugin-tester');
const plugin = require('./');

pluginTester({
  plugin,
  tests: {
    'Does not modify code when not a test': {
      code: `
      const add = async (a, b) => Promise.resolve(a + b);
      `
    },
    'Adds number of assertions and has assertions check when given one expect statement in then': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('resolves 1', async () => {
          Promise.resolve(1).then(value => expect(value).toBe(1));
        });

        it('resolves 1', async () => {
          Promise.resolve(1).then(value => {
            expect(value).toBe(1)
          });
        });
      });
      `
    },
    'Adds number of assertions and has assertions check when given one expect statement in catch': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('rejects 1', async () => {
          Promise.reject(1).catch(value => expect(value).toBe(1));
        });

        it('rejects 1', async () => {
          Promise.reject(1).catch(value => {
            expect(value).toBe(1)
          });
        });
      });
      `
    },
    'Adds number of assertions and has assertions check when given multiple expect statement in try/catch when awaiting': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('resolves 1', async () => {
          try {
            const value = await Promise.resolve(1);
            expect(value).toBe(1);
          } catch (e) {
            expect(true).toBe(false);
          }
        });

        it('rejects 1', async () => {
          try {
            const value = await Promise.reject(1);
            expect(true).toBe(false);
          } catch (e) {
            expect(value).toBe(1);
          }
        });
      });
      `
    },
    'Does not add expect.assertions when expect.assertions is supplied': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('resolves 1', async () => {
          expect.assertions(1);
          try {
            const value = await Promise.resolve(1);
            expect(value).toBe(1);
          } catch (e) {
            expect(true).toBe(false);
          }
        });
      });
      `
    },
    'Adds expect.assertions when expect.hasAssertions is supplied': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('resolves 1', async () => {
          expect.hasAssertions();
          try {
            const value = await Promise.resolve(1);
            expect(value).toBe(1);
          } catch (e) {
            expect(true).toBe(false);
          }
        });
      });
      `
    },
    'Does not add expect.assertions when no assertions are supplied': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('resolves 1', async () => {
          try {
            const value = await Promise.resolve(1);
            console.log(value);
          } catch (e) {
            console.log(e);
          }
        });
      });
      `
    },
    'Does not count commented out expect statements': {
      snapshot: true,
      code: `
      describe('.add', () => {
        it('resolves 1', async () => {
          // expect(add(1, 2)).toEqual(3);
          try {
            /*
              expect(add(4, 5).toEqual(9));
            */
            const value = await Promise.resolve(add(0, 1));
            expect(value).toEqual(1);
            // expect(value).toEqual(2);
          } catch (err) {
            /*
              expect(add(6, 1).toEqual(7));
              */
          }
        });
      });
      `
    }
  }
});
