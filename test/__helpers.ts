import { envsafe } from '../src';

let consoleError: jest.SpyInstance;
let alert: jest.SpyInstance;

export function mockAlertAndConsole() {
  alert = jest.spyOn(window, 'alert').mockImplementationOnce((() => {
    // do nothing
  }) as any);

  consoleError = jest.spyOn(console, 'error').mockImplementationOnce(() => {
    // do nothing
  });

  return { mockConsoleError: consoleError };
}

export function expectExitAndAlertWasCalled() {
  expect(alert).toHaveBeenCalledTimes(1);

  expect(consoleError).toHaveBeenCalledTimes(1);

  const consoleMessage: string = consoleError!.mock.calls[0][0];

  consoleError.mockClear();
  alert!.mockClear();

  return { consoleMessage };
}

export function expectError(...args: Parameters<typeof envsafe>) {
  mockAlertAndConsole();
  expect(() => envsafe(...args)).toThrowError();
  const res = expectExitAndAlertWasCalled();

  return res;
}
