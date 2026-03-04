# Deploying the Protected Thesis Route

## Setup environment variables on Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add these two variables for **Production**, **Preview**, and **Development**:

   - `THESIS_PASSWORD` → strong password you will share with allowed viewers
   - `THESIS_SESSION_SECRET` → random secret (e.g. `openssl rand -hex 32`)

3. Redeploy after adding/updating these values

## Local development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Set real values in `.env`:
   ```env
   THESIS_PASSWORD=your-secure-password
   THESIS_SESSION_SECRET=your-long-random-secret
   ```

3. Start dev server:
   ```bash
   bun run dev
   ```

4. Open `http://localhost:4321/thesis/` (you will be redirected to login)

## Content structure (important)

Use the full exported static site folder under:

`src/private/thesis/`

Expected structure (example):

```text
src/private/thesis/
  index.html
  00_thesis/
  clippings/
  site-lib/
```

`site-lib/` and all exported note folders must be present so JS/CSS/search/graph dependencies load correctly.

## How routing works now

- `/thesis/login` → login page
- `/api/thesis-login` → sets signed auth cookie on success
- `/thesis/` → serves `src/private/thesis/index.html` through server route
- `/thesis/*` → catch-all file server from `src/private/thesis/**`

All `/thesis*` routes are protected by middleware (except login + login API).

## Updating thesis content

1. Export your Obsidian Publish/static site
2. Replace contents of `src/private/thesis/` with the new export
3. Keep `index.html`, `site-lib/`, and note folders intact
4. Redeploy

## Security notes

- Auth cookie is signed with HMAC-SHA256 (`THESIS_SESSION_SECRET`)
- Cookie is `httpOnly`, `sameSite=lax`, and `secure` in production
- Unauthenticated requests to any `/thesis/*` file are redirected to `/thesis/login`
- File server applies no-cache + no-index headers
- Session lifetime is 24 hours
