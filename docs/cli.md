# CLI Options

| Option              | Description                               |
|---------------------|-------------------------------------------|
| `--show-all-chunks` | Print all chunks to the console           |
| `--debug`           | Enable debug logs                         |
| `--export`          | Save each chunk as a separate `.txt` file |

All options are optional. Clipboard is always read, and the first chunk is copied back.

## Example

```bash
node src/index.mjs --debug --export --show-all-chunks
```
