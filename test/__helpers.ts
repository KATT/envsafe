import { envsafe } from '../src';

let consoleError: jest.SpyInstance;
let alert: jest.SpyInstance;

export function mockExitAndConsole() {
  alert = jest.spyOn(window, 'alert').mockImplementationOnce((() => {
    // do nothing
  }) as any);

  consoleError = jest.spyOn(console, 'error').mockImplementationOnce(() => {
    // do nothing
  });

  return { mockConsoleError: consoleError };
}
export function mockExitAndConsoleWasCalled() {
  expect(alert).toHaveBeenCalledTimes(1);

  expect(consoleError).toHaveBeenCalledTimes(1);

  const consoleMessage = consoleError!.mock.calls[0][0];

  consoleError.mockClear();
  alert!.mockClear();

  return { consoleMessage };
}

export function expectError(...args: Parameters<typeof envsafe>) {
  mockExitAndConsole();
  expect(() => envsafe(...args)).toThrowError();
  const res = mockExitAndConsoleWasCalled();

  return res;
}
