import { cleanEnv } from '../src';
import { num } from '../src/validators';

describe('num', () => {
  test('happy', () => {
    const opts = { num: num() };
    expect(cleanEnv({ num: '1' }, opts)).toEqual({
      num: 1,
    });
  });
  test('sad', () => {
    expect(() => cleanEnv({}, { num: num() })).toThrowError();
    expect(() => cleanEnv({ num: 'string' }, { num: num() })).toThrowError();
  });
});
