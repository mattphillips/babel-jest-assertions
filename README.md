<div align="center">
  <h1>babel-jest-assertions</h1>

  🃏⁉️

  Adds expect.assertions(n) and expect.hasAssertions to all tests automatically
</div>

<hr />

[![Build Status](https://img.shields.io/travis/mattphillips/babel-jest-assertions.svg?style=flat-square)](https://travis-ci.org/mattphillips/babel-jest-assertions)
[![Code Coverage](https://img.shields.io/codecov/c/github/mattphillips/babel-jest-assertions.svg?style=flat-square)](https://codecov.io/github/mattphillips/babel-jest-assertions)
[![version](https://img.shields.io/npm/v/babel-jest-assertions.svg?style=flat-square)](https://www.npmjs.com/package/babel-jest-assertions)
[![downloads](https://img.shields.io/npm/dm/babel-jest-assertions.svg?style=flat-square)](http://npm-stat.com/charts.html?package=babel-jest-assertions&from=2017-09-14)
[![MIT License](https://img.shields.io/npm/l/babel-jest-assertions.svg?style=flat-square)](https://github.com/mattphillips/babel-jest-assertions/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Roadmap](https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square)](https://github.com/mattphillips/babel-jest-assertions/blob/master/docs/ROADMAP.md)
[![Examples](https://img.shields.io/badge/%F0%9F%92%A1-examples-ff615b.svg?style=flat-square)](https://github.com/mattphillips/babel-jest-assertions/blob/master/docs/EXAMPLES.md)

## Problem

Ever wondered if your tests are actually running their assertions, especially in asynchronous tests? Jest has two features
built in to help with this: [`expect.assertions(number)`](https://facebook.github.io/jest/docs/en/expect.html#expectassertionsnumber)
and [`expect.hasAssertions()`](https://facebook.github.io/jest/docs/en/expect.html#expecthasassertions). These can be
useful when doing something like:

```js
it('resolves to one', () => {
  Promise.reject(1).then(value => expect(value).toBe(1));
});
```

The issue here is the `catch` case is not dealt with in this test, _which is fine as we are testing the happy path_,
but this test will currently pass even though the `Promise` rejects and the assertion is never ran.

## Solution

One solution is to manually adjust the above test to include `expect.assertions(number)` and `expect.hasAssertions()`
this is quite verbose and prone to human error.

An alternative is a babel plugin to automate adding these additional properties, and this is such plugin 😉

## Installation

With npm:
```sh
npm install --save-dev babel-jest-assertions
```

With yarn:
```sh
yarn add -D babel-jest-assertions
```

## Setup

### .babelrc

```json
{
  "plugins": ["babel-jest-assertions"]
}
```

### CLI

```sh
babel --plugins babel-jest-assertions script.js
```

### Node

```javascript
require('babel-core').transform('code', {
  plugins: ['babel-jest-assertions'],
})
```

## Usage

Simply write your tests as you would normally and this plugin will add the verification of assertions in the background.

**One assertion**
```js
it('resolves to one', () => {
  Promise.reject(1).then(value => expect(value).toBe(1));
});
```

`↓ ↓ ↓ ↓ ↓ ↓`

```js
it('resolves to one', () => {
  expect.hasAssertions();
  expect.assertions(1);
  Promise.reject(1).then(value => expect(value).toBe(1));
});
```
_Note_: this test will now fail 🎉

**Multiple assertions**
```js
it('counts multiple assertions too', () => {
  expect(1 + 0).toBe(1);
  expect(0 + 1).toBe(1);
});
```

`↓ ↓ ↓ ↓ ↓ ↓`

```js
it('counts multiple assertions too', () => {
  expect.hasAssertions();
  expect.assertions(2);
  expect(1 + 0).toBe(1);
  expect(0 + 1).toBe(1);
});
```

**Asynchronous assertions**
```js
it('counts multiple assertions too', async () => {
  const res = await fetch('www.example.com');
  expect(res.json).toBeTruthy();
  const json = await res.json();
  expect(json).toEqual({ whatever: 'trevor' });
});
```

`↓ ↓ ↓ ↓ ↓ ↓`

```js
it('counts multiple assertions too', async () => {
  expect.hasAssertions();
  expect.assertions(2);
  const res = await fetch('www.example.com');
  expect(res.json).toBeTruthy();
  const json = await res.json();
  expect(json).toEqual({ whatever: 'trevor' });
});
```

**beforeEach and afterEach blocks**

If you have expectations inside either of `beforeEach` or `afterEach` blocks for your test then these expects will be
included in the count - even if you have nested describe blocks each with their own `beforeEach`/`afterEach` the count
will accumulate.

```js
beforeEach(() => {
  expect(true).toBe(true);
});

afterEach(() => {
  expect(true).toBe(true);
});

describe('.add', () => {
  beforeEach(() => {
    expect(true).toBe(true);
  });
  afterEach(() => {
    expect(true).toBe(true);
  });
  it('returns 1 when given 0 and 1', () => {
    expect(add(1, 0)).toEqual(1);
  });

  describe('.add2', () => {
    beforeEach(() => {
      expect(true).toBe(true);
    });
    afterEach(() => {
      expect(true).toBe(true);
    });
    it('returns 1 when given 0 and 1', () => {
      expect(add2(1, 0)).toEqual(1);
    });
  });
});

      ↓ ↓ ↓ ↓ ↓ ↓

beforeEach(() => {
  expect(true).toBe(true);
});

afterEach(() => {
  expect(true).toBe(true);
});

describe('.add', () => {
  beforeEach(() => {
    expect(true).toBe(true);
  });
  afterEach(() => {
    expect(true).toBe(true);
  });
  it('returns 1 when given 0 and 1', () => {
    expect.assertions(5);
    expect.hasAssertions();

    expect(add2(1, 0)).toEqual(1);
  });

  describe('.add2', () => {
    beforeEach(() => {
      expect(true).toBe(true);
    });
    afterEach(() => {
      expect(true).toBe(true);
    });
    it('returns 1 when given 0 and 1', () => {
      expect.assertions(7);
      expect.hasAssertions();

      expect(add2(1, 0)).toEqual(1);
    });
  });
});
```

**Comments are ignored**
```js
it('ignores commented-out assertions', async () => {
  const res = await fetch('www.example.com');
  // expect(res.json).toBeTruthy();
  const json = await res.json();
  /*
    expect(json).toEqual({ whatever: 'trevor1' });
  */
  expect(json).toEqual({ whatever: 'trevor' });
  /* expect(json).toEqual({ whatever: 'trevor2' }); */
});
```

`↓ ↓ ↓ ↓ ↓ ↓`

```js
it('counts multiple assertions too', async () => {
  expect.hasAssertions();
  expect.assertions(1);
  const res = await fetch('www.example.com');
  // expect(res.json).toBeTruthy();
  const json = await res.json();
  /*
    expect(json).toEqual({ whatever: 'trevor1' });
  */
  expect(json).toEqual({ whatever: 'trevor' });
  /* expect(json).toEqual({ whatever: 'trevor2' }); */
});
```

### Override

If you add either `expect.assertions(number)` or `expect.hasAssertions()` then your defaults will be favoured and the
plugin will skip the test.

```js
it('will leave test as override supplied', () => {
  expect.hasAssertions();
  expect.assertions(1);

  if (true) {
    expect(true).toBe(true);
  }

  if (false) {
    expect(false).toBe(false);
  }
});
```

`↓ ↓ ↓ ↓ ↓ ↓`

```js
it('will leave test as override supplied', () => {
  expect.hasAssertions();
  expect.assertions(1);

  if (true) {
    expect(true).toBe(true);
  }

  if (false) {
    expect(false).toBe(false);
  }
});
```

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars0.githubusercontent.com/u/5610087?v=4" width="100px;"/><br /><sub>Matt Phillips</sub>](http://mattphillips.io)<br />[💻](https://github.com/mattphillips/babel-jest-assertions/commits?author=mattphillips "Code") [📖](https://github.com/mattphillips/babel-jest-assertions/commits?author=mattphillips "Documentation") [🚇](#infra-mattphillips "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/mattphillips/babel-jest-assertions/commits?author=mattphillips "Tests") | [<img src="https://avatars0.githubusercontent.com/u/266594?v=4" width="100px;"/><br /><sub>Ramesh Nair</sub>](https://hiddentao.com/)<br />[💻](https://github.com/mattphillips/babel-jest-assertions/commits?author=hiddentao "Code") [📖](https://github.com/mattphillips/babel-jest-assertions/commits?author=hiddentao "Documentation") [💡](#example-hiddentao "Examples") [⚠️](https://github.com/mattphillips/babel-jest-assertions/commits?author=hiddentao "Tests") | [<img src="https://avatars1.githubusercontent.com/u/7352279?v=4" width="100px;"/><br /><sub>Huy Nguyen</sub>](https://www.huy-nguyen.com/)<br />[🐛](https://github.com/mattphillips/babel-jest-assertions/issues?q=author%3Ahuy-nguyen "Bug reports") | [<img src="https://avatars2.githubusercontent.com/u/923865?v=4" width="100px;"/><br /><sub>Simon Boudrias</sub>](http://simonboudrias.com)<br />[🐛](https://github.com/mattphillips/babel-jest-assertions/issues?q=author%3ASBoudrias "Bug reports") | [<img src="https://avatars3.githubusercontent.com/u/711311?v=4" width="100px;"/><br /><sub>Giuseppe</sub>](http://giuseppe.pizza)<br />[🤔](#ideas-giuseppeg "Ideas, Planning, & Feedback") |
| :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## LICENSE

MIT
