import { cleanEnv } from '../src';
import { num, str } from '../src/validators';
import { mockExitAndConsole, mockExitAndConsoleWasCalled } from './__helpers';

test('devDefault', () => {
  expect(
    cleanEnv(
      {
        num: num({
          devDefault: 1,
        }),
        str: str({
          devDefault: 'str',
        }),
      },
      {
        env: {},
      },
    ),
  ).toEqual({
    num: 1,
    str: 'str',
  });
});

test('default', () => {
  expect(
    cleanEnv(
      {
        num: num({
          default: 1,
        }),
        str: str({
          default: 'str',
        }),
      },
      {
        env: {},
      },
    ),
  ).toEqual({
    num: 1,
    str: 'str',
  });
});

test('devDefault versus default presedence', () => {
  const opts = {
    str: str({
      default: 'default',
      devDefault: 'devDefault',
    }),
  };
  expect(
    cleanEnv(opts, {
      env: {
        NODE_ENV: 'development',
      },
    }),
  ).toEqual({
    str: 'devDefault',
  });

  expect(
    cleanEnv(opts, {
      env: {
        NODE_ENV: 'production',
      },
    }),
  ).toEqual({
    str: 'default',
  });
});

test('parses default values', () => {
  expect(
    cleanEnv(
      {
        num: num({
          default: 0,
        }),
      },
      { env: {} },
    ),
  ).toEqual({ num: 0 });
  expect(
    cleanEnv(
      {
        num: num({
          default: '0' as any,
        }),
      },
      { env: {} },
    ),
  ).toEqual({ num: 0 });
});

test('fails when default values are wrong', () => {
  mockExitAndConsole();
  expect(() =>
    cleanEnv(
      {
        num: num({
          default: 'not a number' as any,
        }),
      },
      { env: {} },
    ),
  ).toThrowError();
  mockExitAndConsoleWasCalled();
});
