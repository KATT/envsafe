import { cleanEnv } from '../src';
import { num, str } from '../src/validators';

test('devDefault', () => {
  expect(
    cleanEnv(
      {
        NODE_ENV: 'development',
      },
      {
        num: num({
          devDefault: 1,
        }),
        str: str({
          devDefault: 'str',
        }),
      }
    )
  ).toEqual({
    num: 1,
    str: 'str',
  });
});

test('default', () => {
  expect(
    cleanEnv(
      {},
      {
        num: num({
          default: 1,
        }),
        str: str({
          default: 'str',
        }),
      }
    )
  ).toEqual({
    num: 1,
    str: 'str',
  });
});
