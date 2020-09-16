import { str, strictEnv } from '../src';

test('strictEnv', () => {
  const env = strictEnv(
    {
      foo: 'bar',
    },
    {
      foo: str(),
    }
  );
  expect(env.foo).toBe('bar');

  expect(() => (env as any).no).toThrowErrorMatchingInlineSnapshot(
    `"[envsafe] Env var not found: no"`
  );
  expect(() => {
    (env as any).foo = 'nope';
  }).toThrowErrorMatchingInlineSnapshot(
    `"Cannot assign to read only property 'foo' of object '[object Object]'"`
  );

  expect(env.foo).toBe('bar');
});
