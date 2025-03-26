#!/usr/bin/env node

import fs from "fs";
import path from "path";
import clipboardy from "clipboardy";
import { program } from "commander";
import { stripObsidianMarkup, splitIntoDiscordChunks } from "./utils.mjs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🧠 1. Configure CLI arguments
function configureProgram() {
  return program
    .option("--show-all-chunks", "Print all chunks to console")
    .option("--debug", "Enable debug logging")
    .option("--export", "Export chunks as individual text files")
    .option("--input-file <path>", "Read input from file instead of clipboard/stdin")
    .allowUnknownOption()
    .allowExcessArguments();
}

// 📥 2. Read input from clipboard, stdin, or file
async function readInputSource(inputPath, debug = false) {
  console.log("[DEBUG] in readInputSource");
  if (inputPath) {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file does not exist: ${inputPath}`);
    }
    const data = fs.readFileSync(inputPath, "utf8");
    if (debug) {
      console.log(`[DEBUG] Reading input from file: ${inputPath}`);
      console.log("[DEBUG] Read input content (first 200 chars):", data.slice(0, 200));
    }
    return data;
  }

  if (!process.stdin.isTTY) {
    if (debug) console.log("[DEBUG] Reading input from stdin");
    return await new Promise((resolve, reject) => {
      let data = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("readable", () => {
        let chunk;
        while ((chunk = process.stdin.read()) !== null) data += chunk;
      });
      process.stdin.on("end", () => resolve(data));
      process.stdin.on("error", reject);
    });
  }

  if (debug) console.log("[DEBUG] Reading input from clipboard");
  return await clipboardy.read();
}

// 🚀 3. Main logic
export async function main(argv = process.argv) {
  console.log("⚡ main() is running");

  configureProgram().parse(argv);
  const opts = program.opts();
  const args = program.args;

  //if (opts.debug) {
    console.log("[DEBUG] main() invoked with argv:", argv);
    console.log("[DEBUG] Parsed options:", opts);
    console.log("[DEBUG] Remaining args:", args);
  //}

  // 🛠 Support input file passed as positional arg too
  const inputPath = opts.inputFile || args[0];
  const rawText = await readInputSource(inputPath, opts.debug);

  if (!rawText) {
    console.error("❌ No input data found.");
    process.exit(1);
  }

  if (opts.debug) {
    console.log("\n=== RAW TEXT (first 300 chars) ===");
    console.log(rawText.slice(0, 300));
  }

  const cleanedText = stripObsidianMarkup(rawText);

  if (opts.debug) {
    console.log("\n=== CLEANED TEXT (first 300 chars) ===");
    console.log(cleanedText.slice(0, 300));
    console.log("=== CLEANED TEXT LENGTH ===", cleanedText.length);
  }

  const chunks = splitIntoDiscordChunks(cleanedText);

  if (opts.debug) {
    console.log(`[DEBUG] Total chunks: ${chunks.length}`);
  }

  if (chunks.length > 0) {
    await clipboardy.write(chunks[0]);
    console.log("✅ First chunk copied to clipboard.");
  }

  if (opts.showAllChunks) {
    console.log("\n--- All Chunks ---");
    chunks.forEach((chunk, idx) => {
      console.log(`\n--- Chunk ${idx + 1} ---\n`);
      console.log(chunk);
    });
  }

  if (opts.export) {
    const exportDir = path.resolve(process.cwd(), "exported_chunks");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    chunks.forEach((chunk, idx) => {
      const filePath = path.join(exportDir, `chunk-${idx + 1}.txt`);
      fs.writeFileSync(filePath, chunk, "utf8");
      if (opts.debug) {
        console.log(`[DEBUG] Saved chunk ${idx + 1} to ${filePath}`);
      }
    });

    console.log(`📁 Exported ${chunks.length} chunk(s) to: ${exportDir}`);
  }

  if (!opts.showAllChunks && !opts.export) {
    console.log("💡 Use '--show-all-chunks' to see all output or '--export' to write files.");
  }
}

// 🟢 4. Run main() if script is executed directly
if (process.argv[1] === __filename) {
  main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
}
