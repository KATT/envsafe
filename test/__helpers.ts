let mockExit: jest.SpyInstance | null = null;
let mockConsoleError: jest.SpyInstance | null = null;

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

  mockExit!.mockRestore();
  mockExit = null;

  mockConsoleError!.mockRestore();
  mockConsoleError = null;
}
