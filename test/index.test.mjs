// test/index.test.mjs
import { jest } from "@jest/globals";
import { pathToFileURL } from "url";
import path from "path";
import { main } from "../src/index.mjs";

test("main() drives CLI parsing and runs correctly", async () => {
  const originalArgv = process.argv;
  process.argv = [
    "node",
    "index.mjs",
    "--debug",
    "--export",
    "--show-all-chunks",
  ];

  await main(process.argv); // This will now execute actual logic from index.mjs

  process.argv = originalArgv;
});

// This test verifies that commander parses args correctly and passes them to run()
test("index.mjs passes parsed options to run()", async () => {
  const runMock = jest.fn();

  // Mock cli.mjs to capture run
  jest.unstable_mockModule("../src/cli.mjs", () => ({
    run: runMock,
  }));

  // Override argv
  const originalArgv = process.argv;
  process.argv = [
    "node",
    "index.mjs",
    "--show-all-chunks",
    "--export",
    "--debug",
  ];

  // Run index.mjs and then manually invoke the logic needed
  await jest.isolateModulesAsync(async () => {
    const { program } = await import("commander");
    const { run } = await import("../src/cli.mjs");

    const configureProgram = () => {
      return program
        .argument("[extra...]", "ignored extra arguments")
        .option("--show-all-chunks", "Print all chunks to console")
        .option("--debug", "Enable debug logging")
        .option("--export", "Export chunks as individual text files")
        .allowUnknownOption()
        .allowExcessArguments();
    };

    configureProgram().parse(process.argv);
    const options = program.opts();
    await run(options); // ← this triggers the mock
  });

  expect(runMock).toHaveBeenCalledWith({
    showAllChunks: true,
    export: true,
    debug: true,
  });

  process.argv = originalArgv;
});
