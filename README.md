<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue)](#)
[![Issues - matinhuseynzade.com](https://img.shields.io/github/issues/chillmatin/matinhuseynzade.com)](#)
[![GitHub Release](https://img.shields.io/github/v/tag/chillmatin/matinhuseynzade.com)](#)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmatinhuseynzade.com)](#)
[![Astro](https://img.shields.io/badge/Astro-BC52EE?logo=astro&logoColor=fff)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)

</div>

&nbsp;

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/chillmatin/matinhuseynzade.com/blob/main/public/icon/icon-dark.png?raw=true">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/chillmatin/matinhuseynzade.com/blob/main/public/icon/icon-white.png?raw=true">
    <img alt="matinhuseynzade.com logo" src="https://github.com/chillmatin/matinhuseynzade.com/blob/main/public/icon/icon-dark.png?raw=true" width="256">
  </picture>
</div>

<h3 align="center">
  <a href="https://www.matinhuseynzade.com">matinhuseynzade.com</a>
  <br/>
  Free and Open Source Blog Site
</h3>

## Quick Start

### Prerequisites
- Docker and Docker Compose installed

### 1. Set Up Environment Variables

Create a `.env` file in the project root:

```dotenv
PUBLIC_UMAMI_WEBSITE_ID=your-umami-website-id
PUBLIC_UMAMI_SCRIPT_URL=https://your-analytics-domain/script.js
```

These are build-time variables used by Astro. Any changes require a rebuild.

### 2. Deploy

**Development** (with hot reload):
```bash
docker compose -f docker-compose.dev.yml up --build
```
Open http://localhost:4321

**Production**:
```bash
docker compose up --build -d
```

The app runs on port `4321` inside the container.

## Alternative: Local Development

```bash
bun install
bun run dev
```

## Build Details

The `Dockerfile` uses multi-stage builds:
- Builds the Astro app with Bun
- Serves the app via Node.js from `dist/server/entry.mjs`

For pure Docker build without Compose:
```bash
docker build -t matinhuseynzade-com \
  --build-arg PUBLIC_UMAMI_WEBSITE_ID=your-umami-website-id \
  --build-arg PUBLIC_UMAMI_SCRIPT_URL=https://your-analytics-domain/script.js \
  .
docker run --rm -p 4321:4321 matinhuseynzade-com
```

## License
This website's source code is open-sourced under the MIT License.

## Acknowledgements
Initial version of the website has been forked from [Astrofolio](https://github.com/vikas5914/Astrofolio).
