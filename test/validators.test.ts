import { cleanEnv } from '../src';
import { num } from '../src/validators';
import { mockExitAndConsole, mockExitAndConsoleWasCalled } from './__helpers';

describe('num', () => {
  test('happy', () => {
    const opts = { num: num() };
    expect(cleanEnv({ num: '1' }, opts)).toEqual({
      num: 1,
    });
  });
  test('sad', () => {
    mockExitAndConsole()
    expect(() => cleanEnv({}, { num: num() })).toThrowError();
    mockExitAndConsoleWasCalled()

    mockExitAndConsole()
    expect(() => cleanEnv({ num: 'string' }, { num: num() })).toThrowError();
    mockExitAndConsoleWasCalled()
  });
});
