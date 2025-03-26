import { program } from "../index.mjs";
import fs from "fs";

const helpText = program.helpInformation();
fs.writeFileSync("docs/cli.md", helpText);
