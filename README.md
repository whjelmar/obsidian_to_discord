# 🧹 Obsidian to Discord

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

> Strip Obsidian markup and split text into Discord-pasteable chunks, directly from your clipboard.  
> Perfect for copying clean content into Discord from notes or logs.

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Examples](#examples)
- [Running Tests](#running-tests)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

---

## 📖 About

**Obsidian to Discord** is a lightweight Node.js script that:

- Reads clipboard content on Windows
- Strips Obsidian-specific markdown
- Cleans and flattens the result for plain-text sharing
- Automatically chunks the output for Discord (Discord has a 2000 character limit)

Useful for note-takers, content creators, or DMs sharing formatted content.

---

## ✨ Features

- 📋 Clipboard support (Windows/macOS/Linux)
- 🧽 Removes Obsidian formatting (e.g., `[[links]]`, `**bold**`, YAML frontmatter)
- ✂️ Automatically splits long text into Discord-safe chunks
- 🧪 Includes unit tests for behavior validation
- 🛠 Easily customizable and extensible

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)

### Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/obsidian-to-discord.git
cd obsidian-to-discord
npm install
```

### Usage

1. Copy some text from Obsidian.
2. Run the script:

```bash
node index.js
```

3. The cleaned text will be printed and the first chunk will be copied back to your clipboard, ready to paste into Discord.

Note: If the output is longer than 2000 characters, it will be split into chunks. Only the first chunk is auto-copied. You’ll need to grab the others from the terminal output.

### 💡 Examples

#### Input from Obsidian
yaml
Copy
Edit
---
tags: [campaign, session]
---

```
# [[Session 12]]

**Drake** found the [[artifact]] in the ruins.

> "We should leave by morning," said Elise.

![image](link.png)

#log/session/game
```

#### Output in Discord

```
Session 12

Drake found the artifact in the ruins.

"We should leave by morning," said Elise.
```


### ✅ Running Tests
Run the test suite using Jest:

```
npm test
```

Test file is located in test.js and covers both text cleaning and chunking behavior.

### 🛡️ License

This project is licensed under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

You are free to:

- ✅ Share — copy and redistribute the material in any medium or format  
- ✅ Adapt — remix, transform, and build upon the material for any purpose, even commercially  

As long as you:

- 📝 **Give appropriate credit** to the original author (William Hjelmstad)
- 🔗 Provide a link to the license: [https://creativecommons.org/licenses/by/4.0/](https://creativecommons.org/licenses/by/4.0/)
- ✍️ Indicate if changes were made

© 2025 Walter Hjelmar

---

##$ 🙏 Acknowledgements

- clipboardy for clipboard access
- Jest for easy and expressive testing
- readme.so for the README scaffolding inspiration

