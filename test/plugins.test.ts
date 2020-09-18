import { nextjsWebpackPlugin, craWebpackPlugin } from '../src/plugins/webpack';

test('cra', () => {
  const webpackSpy = jest.fn(args => args) as any;
  expect(
    craWebpackPlugin({
      browserEnv: {},
      webpack: {
        DefinePlugin: webpackSpy,
      },
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "process.browserEnv": "{}",
    }
  `);
  expect(
    craWebpackPlugin({
      browserEnv: {
        REACT_APP_TEST: '',
      },
      webpack: {
        DefinePlugin: webpackSpy,
      },
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "process.browserEnv": "{\\"REACT_APP_TEST\\":\\"\\"}",
    }
  `);

  expect(() =>
    craWebpackPlugin({
      browserEnv: {
        NEXT_PUBLIC_TEST: '',
        WITHOUT_PREFIX: '',
      },
      webpack: {
        DefinePlugin: webpackSpy,
      },
    }),
  ).toThrowErrorMatchingInlineSnapshot(`"Invalid"`);
});

test('nextjs', () => {
  const webpackSpy = jest.fn(args => args) as any;
  expect(
    nextjsWebpackPlugin({
      browserEnv: {},
      webpack: {
        DefinePlugin: webpackSpy,
      },
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "process.browserEnv": "{}",
    }
  `);
  expect(
    nextjsWebpackPlugin({
      browserEnv: {
        NEXT_PUBLIC_TEST: '',
      },
      webpack: {
        DefinePlugin: webpackSpy,
      },
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "process.browserEnv": "{\\"NEXT_PUBLIC_TEST\\":\\"\\"}",
    }
  `);

  expect(() =>
    nextjsWebpackPlugin({
      browserEnv: {
        NEXT_PUBLIC_TEST: '',
        WITHOUT_PREFIX: '',
      },
      webpack: {
        DefinePlugin: webpackSpy,
      },
    }),
  ).toThrowErrorMatchingInlineSnapshot(`"Invalid"`);
});
