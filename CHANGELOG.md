# Changelog

All notable changes to this project are documented in this file.

## v2.0.1 - 2026-03-14

Compared with `v2.0.0`, this patch release focuses on embed migration cleanup, stronger TypeScript compatibility, and minor content/page maintenance.

### Changed

- Replaced React-based embed components with Astro-native alternatives:
  - `src/components/mdx/Tweet.astro` now uses `astro-tweet`
  - `src/components/mdx/YouTube.astro` now uses `@astro-community/astro-embed-youtube`
- Improved typing in client-side components:
  - added explicit Goodreads response typing in `src/components/GoodreadsWidget.astro`
  - replaced `any` usage in global gallery state with typed `window.__globalGallery` in `src/components/mdx/globalGallery.ts`
- Updated Astro content schema import for compatibility:
  - switched `z` import to `astro/zod` in `src/content.config.ts`
- Added `is:inline` to blog JSON-LD script for Astro runtime expectations in `src/pages/blog/[...slug].astro`
- Minor cleanup of unused imports/variables and callback args in:
  - `src/pages/about.astro`
  - `src/pages/projects/index.astro`
  - `src/pages/rss.xml.js`
  - `src/pages/atom.xml.js`

### Dependency And Config Updates

- Added development type packages:
  - `@types/markdown-it`
  - `@types/sanitize-html`
- Updated lockfile and TypeScript exclusions:
  - `bun.lockb`
  - `tsconfig.json`

### Notes

- This is a patch release with no intentional breaking changes.
- Build validation passed successfully before release (`bun run build`).

## v2.0.0 - 2026-03-14

Compared with `v1.3.0`, this release introduces a major framework upgrade, new user-facing pages, thesis-area improvements, feed/runtime improvements, and multiple UX/content refinements.

### Highlights

- Upgraded core stack to Astro 6 and refreshed dependencies across the project.
- Added and improved key pages: `/use`, `/now`, `/about`, `/reads`, and blog-related views.
- Expanded thesis area with password-protected access flow and login/session handling.
- Improved feed and content pipeline for Goodreads, RSS/Atom generation, and embed handling.
- Updated site UX with improved footer behavior, scroll-to-top button, smoother layout behavior, and refreshed profile assets.

### Added

- New `/use` page documenting the tools and setup used day to day.
- Dynamic Goodreads "currently reading" integration.
- OPML-linked and updated reading/feed related output in `public/reads.xml` and related pages.
- Password-protected thesis area and related routes/components:
  - `src/pages/thesis/login.astro`
  - `src/pages/thesis/index.ts`
  - `src/pages/thesis/[...path].ts`
  - `src/pages/api/thesis-login.ts`
  - `src/lib/thesisAuth.ts`
  - `src/middleware.ts`
- New API endpoint for Goodreads integration:
  - `src/pages/api/goodreads.ts`
- New release documentation:
  - `CHANGELOG.md`

### Changed

- Major dependency upgrades (including Astro and integrations):
  - `astro` `5.7.10` -> `6.0.4`
  - `@astrojs/mdx` `4.2.6` -> `5.0.0`
  - `@astrojs/react` `4.2.7` -> `5.0.0`
  - `@astrojs/vercel` `9.0.4` -> `10.0.0`
  - plus full dependency refresh in `package.json` and `bun.lockb`
- Astro 6 content collection migration:
  - moved `src/content/config.ts` -> `src/content.config.ts`
  - switched to loader-based collections (`glob(...)`)
  - migrated content rendering calls to `render(entry)`
- Routing/slug handling updates to keep content routes stable in Astro 6:
  - introduced `src/utils/contentSlug.js`
  - updated dynamic routes and feed links to derive slugs from entry IDs consistently
- Transitions API migration:
  - replaced `ViewTransitions` with `ClientRouter` in `src/layouts/Base.astro`
- Open Graph generation alignment:
  - updated root OG image naming to `/index.png`
  - changes in `src/utils/opengraph.ts` and `src/config.js`
- UI/content refreshes across key pages and assets:
  - profile image moved to `public/profile.webp`
  - favicon/icon set updates
  - improvements in `src/assets/styles/global.css`, `src/layouts/Base.astro`, `src/pages/about.astro`, `src/pages/index.astro`

### Fixed

- Resolved `/blog/undefined` and 404s on `/now` and `/use` caused by slug API changes after framework upgrade.
- Fixed content rendering compatibility issues introduced by Astro 6 migration.
- Resolved Open Graph validation mismatch during build (`opengraph-image.png` vs generated `index.png`).
- Multiple deployment/runtime fixes for Vercel and Node 22 configuration compatibility.
- RSS/Atom generation improvements and safer content preprocessing for embeds and MDX.

### Removed

- Removed legacy Lenis smooth-scroll scripts/styles:
  - `src/assets/scripts/lenisSmoothScroll.js`
  - `src/assets/styles/lenis.css`
- Removed legacy content config location:
  - `src/content/config.ts`
- Removed old `GoodreadsWidget.tsx` in favor of current implementation.
- Removed older blog entries no longer part of active content set.

### Notes

- This is a major release because of framework/runtime migration and routing/content pipeline changes.
- Build validation was run successfully after migration and route fixes (`bun run build`).
