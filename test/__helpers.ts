let mockExit: jest.SpyInstance;
let mockConsoleError: jest.SpyInstance;

export function mockExitAndConsole() {
  mockExit = jest.spyOn(process, 'exit').mockImplementationOnce((() => {
    // do nothing
  }) as any);

  mockConsoleError = jest.spyOn(console, 'error').mockImplementationOnce(() => {
    // do nothing
  });
}
export function mockExitAndConsoleWasCalled() {
  expect(mockExit).toHaveBeenCalledWith(1);
  expect(mockExit).toHaveBeenCalledTimes(1);

  expect(mockConsoleError).toHaveBeenCalledTimes(1);

  const consoleMessage = mockConsoleError!.mock.calls[0][0];

  mockConsoleError.mockClear();
  mockExit!.mockClear();

  return { consoleMessage };
}
