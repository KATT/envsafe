import { nextjsWebpackPlugin, num, str } from '../src/index';
import { expectExitAndAlertWasCalled, mockAlertAndConsole } from './__helpers';

test('nextjs', () => {
  const webpackSpy = {
    DefinePlugin: jest.fn(args => args) as any,
  };
  expect(
    nextjsWebpackPlugin(
      {
        NEXT_PUBLIC_STR: str(),
        NEXT_PUBLIC_NUM: num(),
      },
      webpackSpy,
      {
        NEXT_PUBLIC_STR: 'hello',
        NEXT_PUBLIC_NUM: '1',
      },
    ),
  ).toMatchInlineSnapshot(`
    Object {
      "process.envsafe": "{\\"NEXT_PUBLIC_STR\\":\\"hello\\",\\"NEXT_PUBLIC_NUM\\":1}",
    }
  `);

  mockAlertAndConsole();
  expect(() =>
    nextjsWebpackPlugin(
      {
        NEXT_PUBLIC_STR: str(),
        WRONG_PREFIX_NUM: num(),
      },
      webpackSpy,
      {
        NEXT_PUBLIC_STR: 'hello',
        WRONG_PREFIX_NUM: '1',
      },
    ),
  ).toThrowErrorMatchingInlineSnapshot(`
"========================================
❌ Invalid environment variables:
    WRONG_PREFIX_NUM: Not prefixed with \\"NEXT_PUBLIC_\\"
========================================"
`);
  expectExitAndAlertWasCalled();
});
