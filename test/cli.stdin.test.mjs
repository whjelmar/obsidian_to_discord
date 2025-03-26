import { jest } from "@jest/globals";
jest.resetModules(); //  Ensure complete isolation

jest.unstable_mockModule("clipboardy", () => ({
  default: {
    read: jest.fn(() => {
      throw new Error("clipboard.read() should not be called");
    }),
    write: jest.fn(),
  },
}));

test("reads from stdin when no clipboard or override", async () => {
  const { stdin: createMockStdin } = await import("mock-stdin");
  const stdin = createMockStdin();
  Object.defineProperty(process, "stdin", { value: stdin });
  process.stdin.isTTY = false;

  const { run } = await import("../src/cli.mjs");
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const runPromise = run({});

  stdin.send("From stdin with ❤️\nLine 2\nLine 3");
  stdin.end();

  await runPromise;

  const log = consoleSpy.mock.calls.flat().join("\n");
  expect(log).toMatch(/First chunk copied/);
  consoleSpy.mockRestore();
});
