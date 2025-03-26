export function stripObsidianMarkup(text) {
  return text
    // Remove frontmatter
    .replace(/^---\n[\s\S]*?\n---\n?/m, "")
    // Remove tags like #tag
    .replace(/(^|\s)(#\w+)/g, "")
    // Remove image embeds like ![[...]]
    .replace(/!\[\[.*?\]\]/g, "") 
    // [[target|alias]] -> target
    .replace(/\[\[(.*?)\|.*?\]\]/g, "$1") 
    // [[target]] -> target    
    .replace(/\[\[(.*?)\]\]/g, "$1")      
    // Remove Markdown bold/italic/code
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    // Remove Markdown images
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Remove inline links [text](url)
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    // Remove blockquotes
    .replace(/^\s*>\s?/gm, "")
    // Normalize multiple blank lines to exactly two
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function splitIntoDiscordChunks(text, limit = 2000) {
  const chunks = [];
  let remaining = text;

  while (remaining.length > limit) {
    let splitIndex = remaining.lastIndexOf("\n", limit);
    if (splitIndex === -1 || splitIndex < limit * 0.5) {
      splitIndex = limit;
    }

    chunks.push(remaining.slice(0, splitIndex).trim());
    remaining = remaining.slice(splitIndex).trim();
  }

  if (remaining.length) {
    chunks.push(remaining);
  }

  return chunks;
}
