/** Longest description search results show in full. */
const DESCRIPTION_LIMIT = 160;
const MARKDOWN_LINK = /\[([^\]]+)\]\([^)]*\)/g;
const SENTENCE_END = /(?<=[.!?])\s+/;

/**
 * Builds a page description from a post's body: its first paragraph, links reduced to their
 * text, cut to whole sentences within the limit. A first sentence over the limit stays whole.
 */
export function describePost(body: string): string {
  const firstParagraph = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .find((paragraph) => paragraph.length > 0);
  const plain = (firstParagraph ?? '').replace(MARKDOWN_LINK, '$1');
  const sentences = plain.split(SENTENCE_END);
  let description = sentences[0];
  for (const sentence of sentences.slice(1)) {
    const longer = `${description} ${sentence}`;
    if (longer.length > DESCRIPTION_LIMIT) {
      break;
    }
    description = longer;
  }
  return description;
}
