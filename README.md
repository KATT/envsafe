[![Maintainability](https://api.codeclimate.com/v1/badges/c17614f0d80b810e47a6/maintainability)](https://codeclimate.com/github/KATT/envsafe/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/c17614f0d80b810e47a6/test_coverage)](https://codeclimate.com/github/KATT/envsafe/test_coverage)

# `env`safe 🔒

Mostly based on the great project [envalid](https://github.com/af/envalid), but with some minor differences

- Rewritten in 100% TypeScript
- Always strict - only get the props you have defined
- No dependencies - smaller bundle for browser/isomorphic apps

## How to use

Works the same in the browser and in node.

```ts
import { str, cleanEnv, url } from 'envsafe';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: 'development',
  }),
  REACT_API_URL: url({
    devDefault: 'https://example.com/graphql',
  }),
  REACT_APP_AUTH0_CLIENT_ID: str({
    devDefault: 'xxxxx',
  }),
  REACT_APP_AUTH0_DOMAIN: str({
    devDefault: 'xxxxx.auth0.com',
  }),
  REACT_APP_SEGMENT_ID: str({
    devDefault: 'xxxxx',
  }),
  REACT_APP_BUGSNAG_API_KEY: str({
    default: 'xxxxx',
  }),
});
```

## Running the project locally

To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types.

## Continuous Integration

### GitHub Actions

A simple action is included that runs these steps on all pushes:

- Installs deps w/ cache
- Lints, tests, and builds

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.
