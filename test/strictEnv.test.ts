import { envsafe, str } from '../src';

test('strictEnv', () => {
  const env = envsafe(
    {
      foo: str(),
    },
    {
      env: {
        foo: 'bar',
      },
      strict: true,
    },
  );
  expect(JSON.stringify(env)).toMatchInlineSnapshot(`"{\\"foo\\":\\"bar\\"}"`);
  expect(env.foo).toBe('bar');

  expect(() => (env as any).no).toThrowErrorMatchingInlineSnapshot(
    `"[envsafe] Env var \\"no\\" not found"`,
  );
  expect(() => {
    (env as any).foo = 'nope';
  }).toThrowErrorMatchingInlineSnapshot(
    `"Cannot assign to read only property 'foo' of object '[object Object]'"`,
  );

  expect(env.foo).toBe('bar');

  expect(env.hasOwnProperty('foo')).toBe(true);
  expect(env.hasOwnProperty('boo')).toBe(false);

  expect(() => (env as any).length).not.toThrow();
  expect(() => (env as any).__esModule).not.toThrow();
  expect(() => (env as any).then).not.toThrow();
  // expect(() => console.log(env)).not.toThrow()
});

test('non-strict (default behavior)', () => {
  const env = envsafe(
    {
      foo: str(),
    },
    {
      env: {
        foo: 'bar',
      },
    },
  );

  expect(env.foo).toBe('bar');
  expect(() => (env as any).boo).not.toThrow();
  expect((env as any).boo).toBeUndefined();
});
