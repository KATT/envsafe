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
  expect(JSON.stringify(env)).toMatchInlineSnapshot(`"{\\"foo\\":\\"bar\\"}"`);
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

  expect(env.hasOwnProperty('foo')).toBe(true);

  expect(() => (env as any).length).not.toThrow();
  expect(() => (env as any).__esModule).not.toThrow();
  expect(() => (env as any).then).not.toThrow();
});
