[![Maintainability](https://api.codeclimate.com/v1/badges/c17614f0d80b810e47a6/maintainability)](https://codeclimate.com/github/KATT/envsafe/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/c17614f0d80b810e47a6/test_coverage)](https://codeclimate.com/github/KATT/envsafe/test_coverage)

# `env`safe 🔒

Mostly based on the great project [envalid](https://github.com/af/envalid), but with some minor differences

- Written in 100% TypeScript
- Always strict - only get the props you have defined
- No dependencies - smaller bundle for browser/isomorphic apps

## How to use

Works the same in the browser and in node. See the [./examples](./examples)-folder for more examples.

```ts
import { str, envsafe, url } from 'envsafe';

export const env = envsafe({
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

It defaults to using `process.env` as a base for plucking the vars, but it can be overridden like this:

```ts
export const env = envsafe(
  {
    ENV_VAR: str({
      devDefault: 'myvar',
    }),
  },
  {
    env: window.__ENVIRONMENT__,
  },
);
```

## Built-in validators

| Function  | return value | Description                                                                                      |
| --------- | ------------ | ------------------------------------------------------------------------------------------------ |
| `str()`   | `string`     | Passes string values through, will ensure an value is present unless a `default` value is given. |
| `bool()`  | `boolean`    | Parses env var strings `"0", "1", "true", "false", "t", "f"` into booleans                       |
| `num()`   | `number`     | Parses an env var (eg. "42", "0.23", "1e5") into a Number                                        |
| `port()`  | `number`     | Ensures an env var is a TCP port (1-65535)                                                       |
| `url()`   | `string`     | Ensures an env var is a url with a protocol and hostname                                         |
| `email()` | `string`     | Ensures an env var is an email address                                                           |
| `json()`  | `unknown`    | Parses an env var with `JSON.parse`                                                              |

### Possible options

All optional.

| Name         | Type                | Description                                                                                                                                                                           |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `choices`    | `TValue[]`          | Allow-list for values                                                                                                                                                                 |
| `default`    | `TValue` / `string` | A fallback value, which will be used if the env var wasn't specified. Providing a default effectively makes the env var optional.                                                     |
| `devDefault` | `TValue` / `string` | A fallback value to use only when `NODE_ENV` is not `production`. This is handy for env vars that are required for production environments, but optional for development and testing. |

These values below are not used by the library and only for description of the variables.

| Name      | Type                | Description                                                        |
| --------- | ------------------- | ------------------------------------------------------------------ |
| `desc`    | `string`            | A string that describes the env var.                               |
| `example` | `string` / `TValue` | An example value for the env var.                                  |
| `docs`    | `string`            | A url that leads to more detailed documentation about the env var. |

## Custom validators/parsers

```ts
import { makeValidator, envsafe } from 'envsafe';

const barParser = makeValidator<'bar'>(input => {
  if (input !== 'bar') {
    throw new InvalidEnvError(`Expected '${input}' to be 'bar'`);
  }
  return 'bar';
});

const env = envsafe({
  FOO: barParser(),
});
```

## Error reporting

By default the reporter will

- Make a readable summary of your issues
- `console.error`-log an error
- Call `process.exit(1)` / `window.alert(text)`
- Throw an error

Can be overridden by the `reporter`-property

```ts
const env = envsafe(
  {
    MY_VAR: str(),
  },
  {
    reporter({ errors, output, env }) {
      // do stuff
    },
  },
);
```

# Contributing

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

```

```
