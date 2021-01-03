import { envsafe, str } from '../src';

test('dont default over empty strings', () => {
  const env = envsafe(
    {
      defaulted: str({
        default: 'default',
        devDefault: 'devDefault',
      }),
      empty: str({
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
        empty: '',
        notDefaulted: 'notDefault',
      },
      allowEmptyStrings: true,
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
