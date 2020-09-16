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

test('devDefault versus default presedence', () => {
  const opts = {
    str: str({
      default: 'default',
      devDefault: 'devDefault',
    }),
  };
  expect(
    cleanEnv(
      {
        NODE_ENV: 'development'
      },
      opts
    )
  ).toEqual({
    str: 'devDefault'
  });

  expect(
    cleanEnv(
      {
        NODE_ENV: 'production'
      },
      opts
    )
  ).toEqual({
    str: 'default'
  });
})


test('parses default values', () => {

  expect(
    cleanEnv(
      {},
      {
        num: num({
          default: 0
        })
      },
    )
  ).toEqual({ num: 0 })
  expect(
    cleanEnv(
      {},
      {
        num: num({
          default: '0' as any
        })
      },
    )
  ).toEqual({ num: 0 })


  expect(() =>
    cleanEnv(
      {},
      {
        num: num({
          default: 'not a number' as any
        })
      },
    )
  ).toThrowError()

})