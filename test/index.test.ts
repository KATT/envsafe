import { cleanEnv } from '../src';
import { EnvError } from '../src/errors';
import { makeValidator, num } from '../src/validators';
import { mockExitAndConsole, mockExitAndConsoleWasCalled } from './__helpers';

const barParser = makeValidator<'bar'>(input => {
  if (input !== 'bar') {
    return new EnvError(`Expected '${input}' to be 'bar'`);
  }
  return 'bar';
});

test('custom parser', () => {
  expect(
    cleanEnv(
      { foo: 'bar' },
      {
        foo: barParser({}),
      }
    )
  ).toEqual({
    foo: 'bar',
  });
});

test('custom parser error', () => {
  mockExitAndConsole();

  expect(() =>
    cleanEnv(
      { foo: 'not bar' },
      {
        foo: barParser({}),
      }
    )
  ).toThrowError();

  const { consoleMessage } = mockExitAndConsoleWasCalled();
  expect(consoleMessage).toMatchInlineSnapshot(`
    "================================
    ❌ Invalid environment variables:
        foo: Expected 'not bar' to be 'bar'
    ================================"
  `);
});

test('missing env', () => {
  mockExitAndConsole();
  expect(() => cleanEnv({}, { num: num() })).toThrowErrorMatchingInlineSnapshot(
    `"Invalid/missing environment variables: num"`
  );

  const { consoleMessage } = mockExitAndConsoleWasCalled();
  expect(consoleMessage).toMatchInlineSnapshot(`
    "================================
    💨 Missing environment variables:
        num: Missing value for num
    ================================"
  `);
});
