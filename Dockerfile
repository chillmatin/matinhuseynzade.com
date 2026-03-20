# syntax=docker/dockerfile:1

FROM oven/bun:1.2 AS deps
WORKDIR /app

ARG PUBLIC_UMAMI_WEBSITE_ID
ARG PUBLIC_UMAMI_SCRIPT_URL
ENV PUBLIC_UMAMI_WEBSITE_ID=$PUBLIC_UMAMI_WEBSITE_ID
ENV PUBLIC_UMAMI_SCRIPT_URL=$PUBLIC_UMAMI_SCRIPT_URL

# Install dependencies first for better layer caching.
COPY package.json bun.lockb ./
COPY patches ./patches
RUN bun install --frozen-lockfile

FROM deps AS dev
COPY . .
EXPOSE 4321
CMD ["bun", "run", "dev", "--host", "0.0.0.0", "--port", "4321"]

FROM deps AS builder

# Build the Astro server output.
COPY . .
RUN bun run build

FROM node:22.13-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Copy runtime artifacts and dependencies required by Astro server output.
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/bun.lockb ./bun.lockb

USER node

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
