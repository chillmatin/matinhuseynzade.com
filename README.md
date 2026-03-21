# Matin Huseynzade's Personal Website

Personal portfolio built with [Astro](https://astro.build/).

Live: [matinhuseynzade.com](https://www.matinhuseynzade.com)

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