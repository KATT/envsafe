import { cleanEnv } from '../src';

let exit: jest.SpyInstance;
let consoleError: jest.SpyInstance;

export function mockExitAndConsole() {
  exit = jest.spyOn(process, 'exit').mockImplementationOnce((() => {
    // do nothing
  }) as any);

  consoleError = jest.spyOn(console, 'error').mockImplementationOnce(() => {
    // do nothing
  });

  return { mockExit: exit, mockConsoleError: consoleError };
}
export function mockExitAndConsoleWasCalled() {
  expect(exit).toHaveBeenCalledWith(1);
  expect(exit).toHaveBeenCalledTimes(1);

  expect(consoleError).toHaveBeenCalledTimes(1);

  const consoleMessage = consoleError!.mock.calls[0][0];

  consoleError.mockClear();
  exit!.mockClear();

  return { consoleMessage };
}

export function expectError(...args: Parameters<typeof cleanEnv>) {
  mockExitAndConsole();
  expect(() => cleanEnv(...args)).toThrowError();
  const res = mockExitAndConsoleWasCalled();

  return res;
}
