import { stripObsidianMarkup, splitIntoDiscordChunks } from "../src/utils.mjs";

test("strips Obsidian markup correctly", () => {
  const input = `
---
tags: [test]
---

# [[Session 12]]

> **Drake** found the [[artifact]] in the ruins.

![image](image.png)

/session/game
`;

  const expected = `# Session 12
Drake found the artifact in the ruins.

/session/game`;

  expect(stripObsidianMarkup(input)).toBe(expected);
});

test("splits long text into Discord chunks", () => {
  const longText = "x".repeat(5000);
  const chunks = splitIntoDiscordChunks(longText, 2000);

  expect(chunks.length).toBeGreaterThan(1);
  expect(chunks.every(chunk => chunk.length <= 2000)).toBe(true);
});

test("stripObsidianMarkup removes various markdown", () => {
  const input = `
# Title
**bold** *italic* \`code\` [[link]]
> quote
`;

  const expected = `# Title
bold italic code link
quote`;

  expect(stripObsidianMarkup(input)).toBe(expected);
});
