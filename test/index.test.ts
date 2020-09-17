import { cleanEnv } from '../src';
import { InvalidEnvError } from '../src/errors';
import { makeValidator, num, str } from '../src/validators';
import {
  expectError,
  mockExitAndConsole,
  mockExitAndConsoleWasCalled,
} from './__helpers';

const barParser = makeValidator<'bar'>(input => {
  if (input !== 'bar') {
    throw new InvalidEnvError(`Expected '${input}' to be 'bar'`);
  }
  return 'bar';
});

test('custom parser', () => {
  expect(
    cleanEnv(
      {
        foo: barParser({}),
      },
      { env: { foo: 'bar' } },
    ),
  ).toEqual({
    foo: 'bar',
  });
});

test('custom parser error', () => {
  mockExitAndConsole();

  expect(() =>
    cleanEnv(
      {
        foo: barParser({}),
      },
      { env: { foo: 'not bar' }, },
    ),
  ).toThrowError();

  const { consoleMessage } = mockExitAndConsoleWasCalled();
  expect(consoleMessage).toMatchInlineSnapshot(`
    "=================================================
    ❌ Invalid environment variables:
        foo: Expected 'not bar' to be 'bar'
    ================================================="
  `);
});

test('missing env', () => {
  mockExitAndConsole();
  expect(() => cleanEnv({ num: num() }, { env: {} }))
    .toThrowErrorMatchingInlineSnapshot(`
"=================================================
💨 Missing environment variables:
    num: Missing value
================================================="
`);

  const { consoleMessage } = mockExitAndConsoleWasCalled();
  expect(consoleMessage).toMatchInlineSnapshot(`
    "=================================================
    💨 Missing environment variables:
        num: Missing value
    ================================================="
  `);
});

test('custom reporter', () => {
  const reporter = jest.fn();

  const mocks = mockExitAndConsole();

  cleanEnv(
    {
      foo: barParser({}),
    },
    { reporter, env: { foo: 'not bar' }, },
  );

  expect(mocks.mockConsoleError).not.toHaveBeenCalled();
  expect(mocks.mockExit).not.toHaveBeenCalled();

  expect(reporter.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "env": Object {
            "foo": "not bar",
          },
          "errors": Object {
            "foo": [TypeError: Expected 'not bar' to be 'bar'],
          },
          "output": Object {},
        },
      ],
    ]
  `);
});

test('choices', () => {
  const opts = {
    str: str({
      choices: ['a', 'b'],
    }),
  };
  expect(cleanEnv(opts, { env: { str: 'a' } }).str).toBe('a');
  const res = expectError(opts, { env: { str: 'c' } });

  expect(res.consoleMessage).toMatchInlineSnapshot(`
    "=================================================
    ❌ Invalid environment variables:
        str: Value \\"c\\" not in choices [a,b]
    ================================================="
  `);
});
