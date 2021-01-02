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

  expect(JSON.stringify(env)).toMatchInlineSnapshot(
    `"{\\"defaulted\\":\\"devDefault\\",\\"alsoDefaulted\\":\\"devDefault\\",\\"notDefaulted\\":\\"notDefault\\"}"`,
  );

  expect(env.defaulted).toBe('devDefault');
  expect(env.alsoDefaulted).toBe('devDefault');
  expect(env.notDefaulted).toBe('notDefault');
});

// test('dont default over empty strings (default behavior)', () => {
//   const env = envsafe(
//     {
//       foo: str(),
//     },
//     {
//       env: {
//         foo: 'bar',
//       },
//     },
//   );
//
//   expect(env.foo).toBe('bar');
//   expect(() => (env as any).boo).not.toThrow();
//   expect((env as any).boo).toBeUndefined();
// });
