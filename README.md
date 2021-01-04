[![Maintainability](https://api.codeclimate.com/v1/badges/c17614f0d80b810e47a6/maintainability)](https://codeclimate.com/github/KATT/envsafe/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/c17614f0d80b810e47a6/test_coverage)](https://codeclimate.com/github/KATT/envsafe/test_coverage)

## `env`safe 🔒

Validate access to environment variables and parse them to the right type. Makes sure you don't accidentally deploy apps with missing or invalid environment variables.

```
========================================
❌ Invalid environment variables:
    API_URL: Invalid url input: "http//example.com/graphql"
💨 Missing environment variables:
    MY_VAR: Missing value or empty string
    PORT: Missing value or empty string
========================================
```

Heavily inspired by the great project [envalid](https://github.com/af/envalid), but with some key differences:

- Written in 100% TypeScript
- **Always strict** - only access the variables you have defined
- Built for node.js **and** the browser
- **No dependencies** - tiny bundle for browser/isomorphic apps

---

- [How to use](#how-to-use)
  - [Install](#install)
  - [Basic usage](#basic-usage)
- [Built-in validators](#built-in-validators)
  - [Possible options](#possible-options)
- [Custom validators/parsers](#custom-validatorsparsers)
- [Error reporting](#error-reporting)
- [Strict mode (recommended for JS-users)](#strict-mode-recommended-for-js-users)

## How to use

Works the same in the browser and in node. See the [`./examples`](./examples)-folder for more examples.

### Install

```sh
yarn add envsafe
```

```sh
npm i envsafe --save
```

### Basic usage

```ts
import { str, envsafe, port, url } from 'envsafe';

export const env = envsafe({
  NODE_ENV: str({
    devDefault: 'development',
    choices: ['development', 'test', 'production'],
  }),
  PORT: port({
    devDefault: 3000,
    desc: 'The port the app is running on',
    example: 80,
  }),
  API_URL: url({
    devDefault: 'https://example.com/graphql',
  }),
  AUTH0_CLIENT_ID: str({
    devDefault: 'xxxxx',
  }),
  AUTH0_DOMAIN: str({
    devDefault: 'xxxxx.auth0.com',
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

| Name         | Type                | Description                                                                                                                                                                                                                               |
| ------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `choices`    | `TValue[]`          | Allow-list for values                                                                                                                                                                                                                     |
| `default`    | `TValue` / `string` | A fallback value, which will be used if the env var wasn't specified. Providing a default effectively makes the env var optional.                                                                                                         |
| `devDefault` | `TValue` / `string` | A fallback value to use only when `NODE_ENV` is not `production`. This is handy for env vars that are required for production environments, but optional for development and testing.                                                     |
| `input`      | `string`            | As some environments don't allow you to dynamically read env vars, we can manually put it in as well. [Example](https://github.com/KATT/envsafe/blob/f74736a24560f22cee5694d48546a247a47425bd/examples/next.js/utils/browserEnv.js#L6-L8) |
| `allowEmpty` | `boolean`           | Default behavior is `false` which treats empty strings as the value is missing; if explicit empty strings are OK, pass in `true`.                                                                                                         |

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
- `window.alert()` with information about the missing envrionment variable if you're in the browser
- Throws an error (will exit the process with a code `1` in node)

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

## Strict mode (recommended for JS-users)

By default envsafe returns a `Readonly<T>` which in TypeScript ensures the env can't be modified and undefined properties from being accessed, but if you're using JavaScript you are still able to access env vars that don't exist. Therefore there's a strict mode option, which is recommended if your project is using vanilla JS, but not recommended if you use TypeScript.

It wraps the function in `Object.freeze` and a `Proxy` that disallows access to any props that aren't defined.

```js
import { envsafe, str } from 'envsafe';

export const browserEnv = envsafe(
  {
    MY_ENV: str(),
  },
  {
    strict: true,
  },
);
```
