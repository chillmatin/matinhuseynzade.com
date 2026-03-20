import { defineConfig } from "astro/config";
import fs from "node:fs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import icon from "astro-icon";
import opengraphImages, { presets } from "astro-opengraph-images";

// https://astro.build/config
export default defineConfig({
  site: "https://www.matinhuseynzade.com",
  security: {
    // Trust forwarded host for these domains when behind reverse proxies (Coolify).
    allowedDomains: [
      { hostname: "matinhuseynzade.com" },
      { hostname: "www.matinhuseynzade.com" },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx({
      image: {
        domains: ["unsplash.com"],
      },
      optimize: true,
      shikiConfig: {
        themes: {
          light: "github-light",
          dark: "github-dark",
          langs: [],
        },
      },
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "prepend",
            properties: {
              className: "anchor",
              ariaLabel: "Section link",
            },
          },
        ],
        rehypeKatex,
      ],
      gfm: true,
    }),
    sitemap(),
    react({
      experimentalReactChildren: true,
    }),
    icon({
      include: {
        "fa6-solid": ["rss", "circle-half-stroke"],
        tabler: ["mail-filled"],
        "fa6-brands": ["x-twitter", "github", "instagram", "linkedin-in", "youtube", "goodreads", "mastodon"],
      },
    }),
    opengraphImages({
      options: {
        fonts: [
          {
            name: "Roboto",
            weight: 400,
            style: "normal",
            data: fs.readFileSync(
              "node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff"
            ),
          },
        ],
      },
      render: presets.simpleBlog,
    }),
  ],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});