import { envsafe, str } from '../src';
import { expectExitAndAlertWasCalled, mockAlertAndConsole } from './__helpers';

test('input with valid value', () => {
  expect(
    envsafe(
      {
        str: str({
          input: 'foo',
        }),
      },
      {
        env: {
          str: 'bar',
        },
      },
    ),
  ).toEqual({
    str: 'foo',
  });
});

test('input with undefined', () => {
  expect(
    envsafe(
      {
        str: str({
          input: undefined,
        }),
      },
      {
        env: {
          str: 'bar',
        },
      },
    ),
  ).toEqual({
    str: 'bar',
  });
});

test('input with inputOnly option', () => {
  mockAlertAndConsole();

  expect(() =>
    envsafe(
      {
        str: str({
          input: undefined,
          inputOnly: true,
        }),
      },
      {
        env: {
          str: 'bar',
        },
      },
    ),
  ).toThrowError();

  const { consoleMessage } = expectExitAndAlertWasCalled();
  expect(consoleMessage).toMatchInlineSnapshot(`
    "========================================
    💨 Missing environment variables:
        str: Missing value or empty string
    ========================================"
  `);
});
