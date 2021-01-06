import { envsafe, str } from '../src';
import { expectExitAndAlertWasCalled, mockAlertAndConsole } from './__helpers';

test('dont default over empty strings', () => {
  const env = envsafe(
    {
      defaulted: str({
        default: 'default',
        devDefault: 'devDefault',
        allowEmpty: true,
      }),
      empty: str({
        default: 'default',
        devDefault: 'devDefault',
        allowEmpty: true,
      }),
      notDefaulted: str({
        default: 'default',
        devDefault: 'devDefault',
        allowEmpty: true,
      }),
    },
    {
      env: {
        empty: '',
        notDefaulted: 'notDefault',
      },
    },
  );

  expect(env.empty).toBe('');
  expect(env.defaulted).toBe('devDefault');
  expect(env.notDefaulted).toBe('notDefault');
});

test('treat empty strings as missing values (default behavior)', () => {
  const env = envsafe(
    {
      defaulted: str({
        default: 'default',
        devDefault: 'devDefault',
      }),
      alsoDefaulted: str({
        default: 'default',
        devDefault: 'devDefault',
      }),
      notDefaulted: str({
        default: 'default',
        devDefault: 'devDefault',
      }),
    },
    {
      env: {
        defaulted: '',
        notDefaulted: 'notDefault',
      },
    },
  );

  expect(env.defaulted).toBe('devDefault');
  expect(env.alsoDefaulted).toBe('devDefault');
  expect(env.notDefaulted).toBe('notDefault');
});

test('default is "" should throw', () => {
  mockAlertAndConsole();
  expect(() =>
    envsafe(
      {
        str: str({
          default: '',
        }),
      },
      { env: {} },
    ),
  ).toThrowError();
  expectExitAndAlertWasCalled();
});

test('devDefault is "" should throw', () => {
  mockAlertAndConsole();
  expect(() =>
    envsafe(
      {
        str: str({
          devDefault: '',
        }),
      },
      {
        env: {
          NODE_ENV: 'development',
        },
      },
    ),
  ).toThrowError();
  expectExitAndAlertWasCalled();
});

test('default "" is ok if allowEmpty', () => {
  const env = envsafe(
    {
      str: str({
        default: '',
        allowEmpty: true,
      }),
    },
    {
      env: {},
    },
  );
  expect(env.str).toBe('');
});

test('devDefault "" is ok if allowEmpty', () => {
  const env = envsafe(
    {
      str: str({
        devDefault: '',
        allowEmpty: true,
      }),
    },
    {
      env: {
        NODE_ENV: 'development',
      },
    },
  );
  expect(env.str).toBe('');
});
