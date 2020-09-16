import { cleanEnv } from '../src';
import { EnvError, makeValidator, num } from '../src/validators';
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

  mockExitAndConsoleWasCalled();
});

test('missing env', () => {
  mockExitAndConsole();
  expect(() => cleanEnv({}, { num: num() })).toThrowError();
  mockExitAndConsoleWasCalled();
});
