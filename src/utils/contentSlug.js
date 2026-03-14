const CONTENT_EXTENSION_RE = /\.(md|mdx)$/;
const TRAILING_INDEX_RE = /\/index$/;

export function getEntrySlug(entryId) {
  const withoutExtension = entryId.replace(CONTENT_EXTENSION_RE, "");
  return withoutExtension.replace(TRAILING_INDEX_RE, "");
}