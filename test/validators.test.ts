import { cleanEnv } from '../src';
import { json, num, port, url, bool, email, str } from '../src/validators';
import {
  expectError,
  mockExitAndConsole,
  mockExitAndConsoleWasCalled,
} from './__helpers';

describe('num', () => {
  test('happy', () => {
    const opts = { num: num() };
    expect(cleanEnv({ num: '1' }, opts)).toEqual({
      num: 1,
    });
  });
  test('sad', () => {
    mockExitAndConsole();
    expect(() => cleanEnv({}, { num: num() })).toThrowError();
    mockExitAndConsoleWasCalled();

    mockExitAndConsole();
    expect(() => cleanEnv({ num: 'string' }, { num: num() })).toThrowError();
    mockExitAndConsoleWasCalled();
  });
});

test('url', () => {
  const opts = { url: url() };

  expectError({}, opts);
  expectError(
    {
      url: 'meep',
    },
    opts
  );

  const parsed = cleanEnv({ url: 'https://example.com?query=test' }, opts);

  expect(parsed.url).toMatchInlineSnapshot(`"https://example.com/?query=test"`);

  expect(parsed.url.protocol).toMatchInlineSnapshot(`"https:"`);
  expect(parsed.url.hostname).toMatchInlineSnapshot(`"example.com"`);
  expect(parsed.url.pathname).toMatchInlineSnapshot(`"/"`);
  expect(parsed.url.search).toMatchInlineSnapshot(`"?query=test"`);
});

test('port', () => {
  const opts = { port: port() };

  expectError({ port: '-1' }, opts);
  expectError({ port: '0' }, opts);
  expectError({ port: '1.2' }, opts);
  expectError({ port: '65536' }, opts);

  expect(cleanEnv({ port: '1' }, opts)).toMatchInlineSnapshot(`
    Object {
      "port": 1,
    }
  `);
});

test('json', () => {
  const opts = { json: json() };

  expectError({ json: '' }, opts);
  expectError({ json: 'undefined' }, opts);

  expect(cleanEnv({ json: 'null' }, opts)).toMatchInlineSnapshot(`
    Object {
      "json": null,
    }
  `);
  expect(cleanEnv({ json: '{}' }, opts)).toMatchInlineSnapshot(`
    Object {
      "json": Object {},
    }
  `);
});

test('bool', () => {
  const opts = { bool: bool() };
  expectError({ bool: 'nah' }, opts);

  expect(cleanEnv({ bool: '1' }, opts).bool).toBe(true);
  expect(cleanEnv({ bool: 'true' as any }, opts).bool).toBe(true);
  expect(cleanEnv({ bool: 't' as any }, opts).bool).toBe(true);

  expect(cleanEnv({ bool: 'false' as any }, opts).bool).toBe(false);
  expect(cleanEnv({ bool: 'f' as any }, opts).bool).toBe(false);
  expect(cleanEnv({ bool: '0' as any }, opts).bool).toBe(false);

  expect(cleanEnv({ bool: true as any }, opts).bool).toBe(true);
  expect(cleanEnv({ bool: false as any }, opts).bool).toBe(false);
});

test('email', () => {
  const opts = { email: email() };

  expectError({ email: 'nah' }, opts);
  expect(cleanEnv({ email: 'test@example.com' }, opts).email).toBe(
    'test@example.com'
  );
});

test('str', () => {
  const opts = { str: str() };

  expectError({ str: null as any }, opts);
  expect(cleanEnv({ str: '1' }, opts).str).toBe('1');
});
