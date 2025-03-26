import { jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import os from "os";

let testText = "";
let exportDir = "";

beforeAll(() => {
  const content =
    "# [[Session 12]]\n\n" +
    "**Drake** found the [[artifact]] in the ruins.\n\n/session/game\n".repeat(100);
  testText = content;
  exportDir = path.resolve("exported_chunks");
});

afterAll(() => {
  if (fs.existsSync(exportDir)) {
    fs.rmSync(exportDir, { recursive: true });
  }
});

test("runs CLI with --show-all-chunks", async () => {
  jest.unstable_mockModule("clipboardy", () => ({
    default: {
      read: jest.fn(),
      write: jest.fn(),
    },
  }));
  const { run } = await import("../src/cli.mjs");
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  await run({ showAllChunks: true, debug: false, export: false }, testText);

  const logCalls = consoleSpy.mock.calls.flat().join("\n");
  expect(logCalls).toMatch(/All Chunks/);
  expect(logCalls).toMatch(/Chunk 1/);
  consoleSpy.mockRestore();
});

test("runs CLI with --export", async () => {
  jest.unstable_mockModule("clipboardy", () => ({
    default: {
      read: jest.fn(),
      write: jest.fn(),
    },
  }));
  const { run } = await import("../src/cli.mjs");
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  await run({ showAllChunks: false, debug: true, export: true }, testText);

  expect(fs.existsSync(exportDir)).toBe(true);
  const files = fs.readdirSync(exportDir);
  expect(files.length).toBeGreaterThan(0);
  consoleSpy.mockRestore();
});

test("runs CLI with both --show-all-chunks and --export", async () => {
  jest.unstable_mockModule("clipboardy", () => ({
    default: {
      read: jest.fn(),
      write: jest.fn(),
    },
  }));
  const { run } = await import("../src/cli.mjs");
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  await run({ showAllChunks: true, debug: false, export: true }, testText);

  const files = fs.readdirSync(exportDir);
  expect(files.length).toBeGreaterThan(0);
  const logCalls = consoleSpy.mock.calls.flat().join("\n");
  expect(logCalls).toMatch(/All Chunks/);
  expect(logCalls).toMatch(/Exported/);
  consoleSpy.mockRestore();
});

test("writes to clipboard once", async () => {
  jest.unstable_mockModule("clipboardy", () => ({
    default: {
      read: jest.fn().mockResolvedValue("This is one small chunk"),
      write: jest.fn(),
    },
  }));
  const { run } = await import("../src/cli.mjs");
  const clipboard = await import("clipboardy");
  clipboard.default.write.mockClear();

  await run({}, "This is one small chunk");

  expect(clipboard.default.write).toHaveBeenCalledTimes(1);
  expect(clipboard.default.write).toHaveBeenCalledWith(expect.any(String));
});

test("prints default suggestion if no flags used", async () => {
  jest.unstable_mockModule("clipboardy", () => ({
    default: {
      read: jest.fn(),
      write: jest.fn(),
    },
  }));
  const { run } = await import("../src/cli.mjs");
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  await run({ showAllChunks: false, debug: false, export: false }, "Just some simple text");

  const logCalls = consoleSpy.mock.calls.flat().join("\n");
  expect(logCalls).toMatch(/Use '--show-all-chunks'/);
  consoleSpy.mockRestore();
});

test("handles empty input safely", async () => {
  jest.unstable_mockModule("clipboardy", () => ({
    default: {
      read: jest.fn().mockResolvedValue(""),
      write: jest.fn(),
    },
  }));
  const { run } = await import("../src/cli.mjs");
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  await run({}, " ");
  const logCalls = consoleSpy.mock.calls.flat().join("\n");
  expect(logCalls).toMatch(/First chunk copied to clipboard/);
  consoleSpy.mockRestore();
});

test("reads from stdin when no clipboard or override", async () => {
  jest.resetModules();
  const { stdin: createMockStdin } = await import("mock-stdin");
  const stdin = createMockStdin();
  Object.defineProperty(process, "stdin", { value: stdin });
  process.stdin.isTTY = false;

  jest.unstable_mockModule("clipboardy", () => ({
    default: {
      read: jest.fn(() => {
        throw new Error("clipboard.read() should not be called");
      }),
      write: jest.fn(),
    },
  }));

  const { run } = await import("../src/cli.mjs");
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const runPromise = run({});

  stdin.send("From stdin with ❤️\nLine 2\nLine 3");
  stdin.end();

  await runPromise;
  const output = consoleSpy.mock.calls.flat().join("\n");
  expect(output).toMatch(/First chunk copied/);
  consoleSpy.mockRestore();
});
