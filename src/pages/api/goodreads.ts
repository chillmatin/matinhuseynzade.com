import type { APIRoute } from "astro";
import { XMLParser } from "fast-xml-parser";

export const prerender = false;

type GoodreadsItem = {
  title: string;
  link: string;
  author?: string;
  coverUrl?: string;
  sortDate?: string;
};

const GOODREADS_RSS_URL =
  "https://www.goodreads.com/review/list_rss/190062890?shelf=currently-reading";

function parseGoodreadsItems(xml: string): GoodreadsItem[] {
  if (!xml) return [];

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    trimValues: true,
  });

  const rss = parser.parse(xml);
  const channel = rss?.rss?.channel;
  const rawItems = channel?.item;
  const items: GoodreadsItem[] = [];

  const collect = (item: any) => {
    if (!item) return;
    if (Array.isArray(item)) {
      item.forEach((node) => collect(node));
      return;
    }

    const title = item.title;
    const link = item.link || item.guid;

    if (!title || !link) return;

    items.push({
      title,
      link,
      author: item.author_name || item.author || item?.book?.author?.name,
      coverUrl:
        item.book_large_image_url ||
        item.book_medium_image_url ||
        item.book_image_url ||
        item.book_small_image_url ||
        item?.book?.image_url,
      sortDate: item.pubDate || item.user_read_at || item.user_added_at,
    });
  };

  collect(rawItems);

  return items;
}

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(GOODREADS_RSS_URL, {
      headers: {
        "User-Agent": "matinhuseynzade.com Goodreads RSS",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch Goodreads" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const xmlText = await response.text();
    const items = parseGoodreadsItems(xmlText)
      .sort((a, b) => {
        const aTime = a.sortDate ? new Date(a.sortDate).getTime() : 0;
        const bTime = b.sortDate ? new Date(b.sortDate).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Timeout or network error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
