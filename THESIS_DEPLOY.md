# Deploying the Protected Thesis Route

## Setup environment variables on Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add these two variables for **Production**, **Preview**, and **Development** environments:

   - `THESIS_PASSWORD` → choose a strong password you'll share with your professor
   - `THESIS_SESSION_SECRET` → generate a random secret like `openssl rand -hex 32`

3. Redeploy your site after adding variables

## Local development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set real values:
   ```
   THESIS_PASSWORD=your-secure-password
   THESIS_SESSION_SECRET=your-long-random-secret
   ```

3. Run dev server:
   ```bash
   bun run dev
   ```

4. Visit `http://localhost:4321/thesis` — you'll be redirected to login

## How it works

- **Unauthenticated requests** to `/thesis` → redirect to `/thesis/login`
- **Login page** prompts for password; cookie lasts 24 hours
- **After login** → `/thesis` serves the protected HTML from `src/private/thesis.html`
- **Security headers** prevent caching and indexing (`X-Robots-Tag`, `Cache-Control`)
- **Robots.txt** disallows `/thesis` paths
- **Sitemap** excludes `/thesis` routes

## Updating thesis content

Replace `src/private/thesis.html` with a new export from Obsidian and redeploy. The file is never publicly accessible.

## Security notes

- Cookie is signed with HMAC-SHA256; cannot be forged without `THESIS_SESSION_SECRET`
- Cookie is `httpOnly` + `secure` (in production) to prevent XSS/MITM
- No direct URL to thesis.html will work; all requests go through auth middleware
- Session expires after 24 hours; user must re-authenticate
