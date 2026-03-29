# Lu Jiande

Official website project for ceramic artist Lu Jiande.  
The site is built as a restrained, image-led single-page experience focused on egg-shell porcelain, bowl-centered forms, light, and material presence.

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## Features

- Scroll-led hero section using three stacked bowl images
- Wide gallery layouts tuned for mostly landscape ceramic photography
- Minimal section structure: Entrance, Form, Light, Variation, Author, Entry
- Docker Compose deployment support
- Nginx reverse proxy template for `lujiande.com`

## Project Structure

```text
app/                    Next.js routes and global styles
components/sections/    Homepage sections
lib/data.ts             Page content and image references
public/images/          Site images
deploy/                 Deployment notes and nginx config
```

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Image Updates

All page image paths are managed in `lib/data.ts`.  
Add image files to `public/images/`, then update the matching `src` fields.

Example:

```ts
images: [
  { src: "/images/hero-1.JPG", alt: "Porcelain bowl, first viewing angle" }
]
```

## Docker Deployment

Run locally or on a server:

```bash
docker compose up --build -d
```

Default port is controlled by `.env`:

```env
APP_PORT=3000
```

## Production Notes

- `next.config.mjs` uses `output: "standalone"` for container deployment
- `deploy/nginx.conf` is the reverse proxy template for `lujiande.com`
- `deploy/DEPLOY.md` contains the basic update and deploy workflow

## Domain

Target domain:

- `lujiande.com`
- `www.lujiande.com`
