import { envsafe, str } from '../src';

test('treatEmptyAsNull', () => {
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
      treatEmptyAsNull: true,
    },
  );

  expect(env.defaulted).toBe('devDefault');
  expect(env.alsoDefaulted).toBe('devDefault');
  expect(env.notDefaulted).toBe('notDefault');
});

test('dont default over empty strings (default behavior)', () => {
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
    },
  );

  expect(env.empty).toBe('');
  expect(env.defaulted).toBe('devDefault');
  expect(env.notDefaulted).toBe('notDefault');
});
