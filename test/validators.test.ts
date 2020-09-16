import { cleanEnv } from '../src';
import { num, port, url } from '../src/validators';
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
