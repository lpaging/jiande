# Lu Jiande

Official website project for ceramic artist Lu Jiande.  
The site is built as a restrained, image-led experience focused on egg-shell porcelain, bowl-centered forms, light, and material presence.

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## Features

- Scroll-led hero section using three stacked bowl images
- Four inner routes: `Works`, `Collections`, `News`, `About`
- Homepage remains a pure exhibition surface; `View Works` acts as the transition into the inner pages
- Wide gallery layouts tuned for mostly landscape ceramic photography
- `Works` uses ratio-aware image presentation to avoid aggressive cropping
- Minimal section structure: Entrance, Form, Light, Variation, Author, Entry
- Docker Compose deployment support
- `public/` bind-mounted in Docker for image-only updates without rebuild
- Nginx reverse proxy template for `lujiande.com`

## Project Structure

```text
app/                    Next.js routes and global styles
components/sections/    Homepage sections
components/site/        Shared inner-page shell
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
  { src: "/images/hero-1.webp", alt: "Porcelain bowl, first viewing angle" }
]
```

Preferred asset format is `webp` for production delivery.

## Content Editing

This project currently does not use a CMS or admin backend.  
The simplest way to update page copy is to edit `lib/data.ts` directly.

Current content strategy:

- Chinese is primary
- English is secondary
- homepage remains the visual reference for tone and restraint

## Docker Deployment

Run locally or on a server:

```bash
docker compose up --build -d
```

Default port is controlled by `.env`:

```env
APP_PORT=3000
```

The `public/` directory is mounted into the container. If you only replace images under `public/images/`, restart the service instead of rebuilding:

```bash
docker compose restart web
```

## Production Notes

- `next.config.mjs` uses `output: "standalone"` for container deployment
- `deploy/nginx.conf` is the reverse proxy template for `lujiande.com`
- `deploy/DEPLOY.md` contains the basic update and deploy workflow

## Domain

Target domain:

- `lujiande.com`
- `www.lujiande.com`
