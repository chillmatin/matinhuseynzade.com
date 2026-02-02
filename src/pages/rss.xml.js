import { getRssString } from "@astrojs/rss";
import { getCollection } from "astro:content";
import { metaData } from "./../config";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

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
  
  // Remove JSX components (self-closing and with children)
  content = content.replace(/<[A-Z][\w]*[^>]*\/>/g, '');
  content = content.replace(/<[A-Z][\w]*[^>]*>.*?<\/[A-Z][\w]*>/gs, '');
  
  // Clean up extra blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  return content.trim();
}

// Extract all images from MDX content (handles Gallery component)
function extractAllImages(mdxContent) {
  const images = [];
  
  // Find all Gallery components and extract ALL src values
  const galleryBlockRegex = /<Gallery[\s\S]*?\/>/g;
  const galleryBlocks = mdxContent.match(galleryBlockRegex) || [];
  
  for (const block of galleryBlocks) {
    // Extract all src: "..." values from this gallery block
    const srcRegex = /src:\s*["']([^"']+)["']/g;
    let srcMatch;
    while ((srcMatch = srcRegex.exec(block)) !== null) {
      const img = srcMatch[1];
      if (!images.includes(img)) {
        images.push(img);
      }
    }
  }
  
  // Fallback: find regular img tags if no components found
  if (images.length === 0) {
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(mdxContent)) !== null) {
      const img = imgMatch[1];
      if (!images.includes(img)) {
        images.push(img);
      }
    }
  }
  
  return images;
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
  
  const items = posts.map((post) => {
    const sanitized = sanitizeHtml(parser.render(preprocessMDX(post.body)), {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "details", "summary"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "width", "height"],
        summary: ["style"],
      },
    });
    
    // Extract all images from raw MDX content (before preprocessing)
    // This captures Gallery component images
    const extractedImages = extractAllImages(post.body);
    const images = post.data.heroImage 
      ? [post.data.heroImage, ...extractedImages]
      : extractedImages;
    
    const itemData = {
      ...post.data,
      link: `/blog/${post.slug}/`,
      content: sanitized,
    };
    
    // Add all images if available - store for later XML manipulation
    if (images.length > 0) {
      itemData.images = images.map(img => ({
        url: img.startsWith('http') ? img : `${context.site}${img}`,
        type: img.endsWith('.png') ? 'image/png' : 'image/jpeg',
      }));
    }
    
    return itemData;
  });

  let rssString = await getRssString({
    title: metaData.title,
    description: metaData.description,
    site: context.site,
    items,
  });

  // Manually inject enclosure tags into RSS items
  rssString = rssString.replace(/<\/item>/g, (match, offset) => {
    // Find the corresponding item in the items array by searching backwards
    const beforeItem = rssString.substring(0, offset);
    const itemStart = beforeItem.lastIndexOf('<item>');
    const itemContent = rssString.substring(itemStart, offset);
    
    // Find which post this corresponds to based on the link
    let enclosureTags = '';
    for (const item of items) {
      if (itemContent.includes(item.link) && item.images) {
        enclosureTags = item.images
          .map(img => `<enclosure url="${img.url}" type="${img.type}" />`)
          .join('');
        break;
      }
    }
    
    return enclosureTags + match;
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
