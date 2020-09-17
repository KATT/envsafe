import { envsafe } from '../src';
import { json, num, port, url, bool, email, str } from '../src/validators';
import {
  expectError,
  mockExitAndConsole,
  mockExitAndConsoleWasCalled,
} from './__helpers';

describe('num', () => {
  test('happy', () => {
    const opts = { num: num() };
    expect(envsafe(opts, { env: { num: '1' } })).toEqual({
      num: 1,
    });
  });
  test('sad', () => {
    mockExitAndConsole();
    expect(() => envsafe({ num: num() }, { env: {} })).toThrowError();
    mockExitAndConsoleWasCalled();

    mockExitAndConsole();
    expect(() =>
      envsafe({ num: num() }, { env: { num: 'string' } }),
    ).toThrowError();
    mockExitAndConsoleWasCalled();
  });
});

test('url', () => {
  const opts = { url: url() };

  expectError(opts, { env: {} });
  expectError(opts, {
    env: {
      url: 'meep',
    },
  });

  const parsed = envsafe(opts, {
    env: { url: 'https://example.com?query=test' },
  });

  expect(parsed.url).toMatchInlineSnapshot(`"https://example.com?query=test"`);
});

test('port', () => {
  const opts = { port: port() };

  expectError(opts, { env: { port: '-1' } });
  expectError(opts, { env: { port: '0' } });
  expectError(opts, { env: { port: '1.2' } });
  expectError(opts, { env: { port: '65536' } });

  expect(envsafe(opts, { env: { port: '1' } })).toMatchInlineSnapshot(`
    Object {
      "port": 1,
    }
  `);
});

test('json', () => {
  const opts = { json: json() };

  expectError(opts, { env: { json: '' } });
  expectError(opts, { env: { json: 'undefined' } });

  expect(envsafe(opts, { env: { json: 'null' } })).toMatchInlineSnapshot(`
    Object {
      "json": null,
    }
  `);
  expect(envsafe(opts, { env: { json: '{}' } })).toMatchInlineSnapshot(`
    Object {
      "json": Object {},
    }
  `);
});

test('bool', () => {
  const opts = { bool: bool() };
  expectError(opts, { env: { bool: 'nah' } });

  expect(envsafe(opts, { env: { bool: '1' } }).bool).toBe(true);
  expect(envsafe(opts, { env: { bool: 'true' as any } }).bool).toBe(true);
  expect(envsafe(opts, { env: { bool: 't' as any } }).bool).toBe(true);

  expect(envsafe(opts, { env: { bool: 'false' as any } }).bool).toBe(false);
  expect(envsafe(opts, { env: { bool: 'f' as any } }).bool).toBe(false);
  expect(envsafe(opts, { env: { bool: '0' as any } }).bool).toBe(false);

  expect(envsafe(opts, { env: { bool: true as any } }).bool).toBe(true);
  expect(envsafe(opts, { env: { bool: false as any } }).bool).toBe(false);
});

test('email', () => {
  const opts = { email: email() };

  expectError(opts, { env: { email: 'nah' } });
  expect(envsafe(opts, { env: { email: 'test@example.com' } }).email).toBe(
    'test@example.com',
  );
});

test('str', () => {
  const opts = { str: str() };

  expectError(opts, { env: { str: null as any } });
  expect(envsafe(opts, { env: { str: '1' } }).str).toBe('1');
});
