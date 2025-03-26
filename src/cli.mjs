#!/usr/bin/env node

import clipboardy from "clipboardy";
import fs from "fs";
import path from "path";
import { stripObsidianMarkup, splitIntoDiscordChunks } from "./utils.mjs";

export async function run(opts = {}, rawInput = null) {
  const input =
    typeof rawInput === "string"
      ? rawInput
      : typeof process.env.TEST_CLIPBOARD_TEXT === "string"
      ? process.env.TEST_CLIPBOARD_TEXT
      : (await readStdinIfAvailable()) ?? (await clipboardy.read());

  const cleanedText = stripObsidianMarkup(input);
  const chunks = splitIntoDiscordChunks(cleanedText);

  console.log("\n=== CLEANED TEXT ===");
  console.log(cleanedText.slice(0, 500));
  console.log("\n=== FULL CLEANED LENGTH:", cleanedText.length);


  if (opts.debug) {
    console.log(`[DEBUG] Total chunks: ${chunks.length}`);
    console.log(`[DEBUG] Input source: ${
      rawInput
        ? "override"
        : process.env.TEST_CLIPBOARD_TEXT
        ? "TEST_CLIPBOARD_TEXT"
        : process.stdin.isTTY
        ? "clipboard"
        : "stdin"
    }`);
  }

  await clipboardy.write(chunks[0]);
  console.log("✅ First chunk copied to clipboard.");

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
      fs.mkdirSync(exportDir, { recursive: true });
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

async function readStdinIfAvailable() {
  if (process.stdin.isTTY) return null;

  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("readable", () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}
