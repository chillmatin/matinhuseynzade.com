import { getRssString } from "@astrojs/rss";
import { getCollection } from "astro:content";
import { metaData } from "./../config";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { getEntrySlug } from "../utils/contentSlug";

const parser = new MarkdownIt({
  html: true, // Enable HTML tags in source
});

// Simple in-memory cache
let cachedFeed = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Preprocess MDX to remove imports and JSX components
function preprocessMDX(mdxContent) {
  let content = mdxContent;
  
  // Remove import statements
  content = content.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  
  // Remove export statements
  content = content.replace(/^export\s+.*?;?\s*$/gm, '');
  
  // Extract YouTube embeds and convert to links with optional title
  content = content.replace(/<YouTube\s+id=['"]([^'"]+)['"](?:\s+title=['"]([^'"]*)['"])?\s*\/>/g, (_match, id, title) => {
    const linkText = title ? `Watch on YouTube: ${title}` : 'Watch on YouTube';
    return `\n\n[${linkText}](https://www.youtube.com/watch?v=${id})`;
  });
  
  // Extract Tweet embeds and convert to links with optional title
  content = content.replace(/<Tweet\s+id=['"]([^'"]+)['"](?:\s+title=['"]([^'"]*)['"])?\s*\/>/g, (_match, id, title) => {
    const linkText = title ? `Tweet: ${title}` : 'Tweet';
    return `\n\n[${linkText}](https://x.com/i/web/status/${id})`;
  });
  
  // Remove JSX components (self-closing and with children)
  content = content.replace(/<[A-Z][\w]*[^>]*\/>/g, '');
  content = content.replace(/<[A-Z][\w]*[^>]*>.*?<\/[A-Z][\w]*>/gs, '');
  
  // Clean up extra blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  return content.trim();
}

export async function GET(context) {
  const now = Date.now();
  
  // Return cached feed if still valid
  if (cachedFeed && (now - cacheTimestamp) < CACHE_DURATION) {
    return new Response(cachedFeed, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
  
  // Generate fresh feed
  const posts = await getCollection("blog");
  
  const items = posts.map((post) => ({
    ...post.data,
    link: `/blog/${getEntrySlug(post.id)}/`,
    content: sanitizeHtml(parser.render(preprocessMDX(post.body)), {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "details", "summary"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        summary: ["style"],
      },
    }),
  }));

  const rssString = await getRssString({
    title: metaData.title,
    description: metaData.description,
    site: context.site,
    items,
  });
  
  // Update cache
  cachedFeed = rssString;
  cacheTimestamp = now;

  return new Response(rssString, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
